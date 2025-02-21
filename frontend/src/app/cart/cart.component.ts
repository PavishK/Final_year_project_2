import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class CartComponent implements OnInit {
  public cartCount: number = 0;
  public makeLoading:boolean=false;
  public cartData: any[] = [];
  public countryData:any[]=[];
  public stateData:any={state:[],district:[]};
  public pinCodeValidation:boolean=false;
  public couponCode:string="";
  public cartTotal: CartSchema = { subtotal: 0, shipping: 0, discount: 0, total: 0 };

  constructor(private http: HttpClient, private storage: StorageService, private toast:ToastrService, private cartService:CartService) {}

  ngOnInit(): void {
    const userData = this.storage.getData();
    if (userData && userData.id) {
      this.makeLoading=true;
      this.http.get<any[]>(`http://localhost:8080/cart-api/display-user-cart-data/${userData.id}`).subscribe({
        next: (res) => {
          this.cartData = res || [];
          this.cartCount = this.cartData.length;
          this.calculateCartTotal();
        },
        error: (err) => {
          console.error('Error fetching cart data:', err);
        }
      });
      this.makeLoading=false;
    }

    this.http.get("http://localhost:8080/country-api/display-country-data").
    subscribe({next:(res:any)=>{
      this.countryData=res;
      this.stateData.state=[...new Set(this.countryData.map(data=>data.state))];
      this.stateData.district=[...new Set(this.countryData.map(data=>data.name))];
    },
    error:(err)=>{
      console.log(err);
    }
  })

  }

  incrementQuantity(cartItem: any): void {
    if (cartItem.stock_quantity > 0 && cartItem.quantity < cartItem.max_quantity) {
      cartItem.quantity += 1;
      cartItem.stock_quantity -= 1;
      cartItem.totalPrice = cartItem.quantity * cartItem.price * cartItem.pack_quantity;
      this.calculateCartTotal();
    }
  }

  decrementQuantity(cartItem: any): void {
    if (cartItem.quantity > cartItem.min_quantity) {
      cartItem.quantity -= 1;
      cartItem.stock_quantity += 1;
      cartItem.totalPrice = cartItem.quantity * cartItem.price* cartItem.pack_quantity;
      this.calculateCartTotal();
    }
  }

  removeItem(index: number,name:string,id:string): void {
    this.cartData.splice(index, 1);
    this.cartCount = this.cartData.length;
    this.calculateCartTotal();
    this.http.delete(`http://localhost:8080/cart-api/delete-user-cart-data/${id}`).
    subscribe({
      next:(res)=>{
        this.toast.success(`${name} has removed from your cart.`);
        this.cartService.addToCart(this.cartCount);
      },
      error:(err)=>{
        this.toast.error(`Unable to remove ${name} from your cart.`);
        console.log(err)
      }
    });

  }

  private calculateCartTotal(): void {
    this.cartTotal.subtotal = this.cartData.reduce((total, item) => total + item.totalPrice, 0);
    this.cartTotal.shipping = this.cartTotal.shipping > 0 ? 50 : 0; // Example shipping calculation
    this.cartTotal.discount = this.cartTotal.subtotal * 0.1; // Example discount of 10%
    this.cartTotal.total = this.cartTotal.subtotal + this.cartTotal.shipping - this.cartTotal.discount;
  }

  public shippingCharge(data:NgForm):void{
    console.log(data.value);
    if(!data.valid){
      this.toast.error("Please fill out the fields!");
      return;
    }
    else{
      if(!/^\d{6}$/.test(data.value.pin))
       this.pinCodeValidation=true;
      else{
        this.http.post(`http://localhost:8080/country-api/get-pincode-location`,data.value).
      subscribe({
        next:(res:any)=>{
            this.cartTotal.shipping=(this.countryData.filter(ele=>ele.state==data.value.state)[0].charge);
            this.calculateCartTotal();
            this.toast.success("Shipping charge claculated!");
            console.log(res);

        },
        error:(err)=>{
          console.log(err.error.message);
          this.pinCodeValidation=true;
          this.cartTotal.shipping=0;
          this.toast.error("Unable to find District for the given pin code!");
        }
      });
      }
      setTimeout(()=>this.pinCodeValidation=false,1200);
     }
    }

    public openAddressPopUp():void{
      if(this.cartTotal.shipping<=0)
        this.toast.info("Please select your shipping address!");
      else{
        console.log("Open")
      }
    }

}

interface CartSchema {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}
