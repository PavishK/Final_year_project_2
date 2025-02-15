import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { RouterManagerService } from '../router-manager.service';
import { StorageService } from '../storage.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-display-product-details',
  templateUrl: './display-product-details.component.html',
  styleUrl: './display-product-details.component.css'
})
export class DisplayProductDetailsComponent implements OnInit {

  public productData:any=[];
  public makeLoading:boolean=false;
  public allProductData:ProductSchema[]=[];
  public countryData:CounterSchema[]=[];
  public matchColor: any = { bread: 'red', cake: 'gray', biscuit: 'orange', rusk: 'green' };
  public popUpState:boolean=false;
  public popUpDescription:boolean=false;
  public randomProducts:ProductSchema[]=[];



  constructor(private route:ActivatedRoute, private toast:ToastrService,private http:HttpClient, private routeMoveTo:RouterManagerService, private storage:StorageService, private cartService:CartService){}

  public MakeLoadingVisible():void{
    this.makeLoading=true;
    setTimeout(()=>{
      this.makeLoading=false;
    },1200);

  }

  public ScrollIntoElement(): void {
    const ele = document.getElementById('goToProduct');
    if (ele)
      ele.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit(): void {

      this.route.params.subscribe(
        params=>{
          this.MakeLoadingVisible();
          console.log(params);
          this.productData=params;

        }
      );

        this.http.get("http://localhost:8080/product-api/list-products")
          .subscribe({
            next: (res: any) => {
              this.allProductData = res.data;
              //this.allProductData=this.allProductData.filter(item=> item.type==this.productData.type ) //&& item._id!=this.productData._id
              this.allProductData=this.allProductData.filter(item=>item._id!=this.productData._id);
              ShowRandomProduct(this.allProductData);
            },
            error: (err:any) => this.toast.error(err.error.message)
          });

          const ShowRandomProduct=(data:ProductSchema[])=>{
            for(let i=0;i<4;i++){
              this.randomProducts.push(data.splice(Math.floor(Math.random()*this.allProductData.length),1)[0]);
            }
            // console.log(this.randomProducts);
          }

      }

      public onClickProduct(data:any):void{
      this.routeMoveTo.moveWithData("/product",data);
    }

      public closeOrOpenStatePopup():void{
        this.http.get("http://localhost:8080/country-api/display-country-data").
        subscribe({next:(res:any)=>{
          this.countryData=res;
        },error:(err)=>{
          this.toast.error("Unable to get states!");
        }})
        this.popUpState=!this.popUpState;
      }
      public closeOrOpenDescriptionPopUp():void{
        this.popUpDescription=!this.popUpDescription;
      }

      public onAddToCartBtnClicked():void{
        const userId=this.storage.getData().id;
        const CartData={
          userId:userId,
          productId:this.productData._id,
          productName:this.productData.name,
          price:Number(this.productData.price),
          quantity:Number(this.productData.minquantity),
          imgSrc:this.productData.src,
          totalPrice:(this.productData.price*this.productData.pieces),
          stock_quantity:Number(this.productData.stock_quandity),
          product_is_veg:this.productData.isVeg,
          product_type:this.productData.type,
          max_quantity:this.productData.maxquantity,
          min_quantity:this.productData.minquantity,
          pack_quantity:this.productData.pieces,
        }
        console.log(CartData);


        this.http.post("http://localhost:8080/cart-api/insert-cart-data",CartData).
        subscribe({
          next:(res:any)=>{
            this.toast.success(`${this.productData.name} has been successfully added to your cart.`);
            this.cartService.addToCart(res.length);
          },error:(err)=>{
            if(err.status==400)
              this.toast.info(`${this.productData.name} is already in the cart!`);
            else
            this.toast.error(`Oops! Unable to add ${this.productData.name} to your cart. Please try again.`);
            console.log(err)
          }
        })
      }


}


interface ProductSchema{
  _id:any;
  name: string;
  type: string;
  price: number;
  src:string;
  desc:string;
  stock_quandity:number;
  rating:number;
  minquantity:number;
  pieces:number;
}

interface CounterSchema{
  _id:any;
  name: string;
  charge:number;
}
