import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCount=new BehaviorSubject<number>(0);
  cartCount$=this.cartCount.asObservable();
  constructor() { }

  addToCart(val:number):void{
    this.cartCount.next(val);
  }

  getCartCount():number{
    return this.cartCount.value;
  }
}
