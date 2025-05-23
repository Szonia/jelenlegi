import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];


  ordersRef : AngularFireList<any>
  
    constructor(private db: AngularFireDatabase) {
      this.ordersRef=db.list("orders")
      this.loadCart();
     }
  

  addToCart(candy: any) {
    console.log("addToCart hívva");
    const existingItem = this.cart.find(item => item.key === candy.key);

    if (existingItem) {
      existingItem.mennyiseg = candy.mennyiseg;
    } else {
      this.cart.push(candy);
    }

    this.saveCart(); 
  }

  getCartItems() {
    return this.cart;
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price * item.mennyiseg, 0);
  }

  removeFromCart(productKey: string) {
    console.log("Eltávolítás hívva, termék kulcs:", productKey);
    this.cart = this.cart.filter(item => item.key !== productKey);
    this.saveCart(); 
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  addOrder(order:any){
    order.Uid="user12"
    order.items=this.cart
    order.status="pending"
    this.ordersRef.push(order)
    this.cart=[]
  }

  getOrders(){
      return this.ordersRef.snapshotChanges().pipe(
        map(
          (changes:any)=>changes.map((c:any)=> ({key:c.payload.key,...c.payload.val() }))
        )
      )
      
     }

}
