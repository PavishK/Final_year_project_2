import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { RouterManagerService } from '../router-manager.service';
import { StorageService } from '../storage.service';
import { CartService } from '../cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-display-product-details',
  templateUrl: './display-product-details.component.html',
  styleUrl: './display-product-details.component.css'
})
export class DisplayProductDetailsComponent implements OnInit {


  public httpUrl:string=environment.httpUrl;

  public productData:any=[];
  public makeLoading:boolean=false;
  public allProductData:ProductSchema[]=[];
  public countryData:CounterSchema[]=[];
  public matchColor: any = { bread: 'red', cake: 'gray', biscuit: 'orange', rusk: 'green' };
  public popUpState:boolean=false;
  public popUpDescription:boolean=false;
  public randomProducts:ProductSchema[]=[];

  public popupLogin:boolean=false;
  public popupLoginComponent:boolean=false;




  constructor(private route:ActivatedRoute,
    private toast:ToastrService,
    private http:HttpClient,
    private routeMoveTo:RouterManagerService,
    private storage:StorageService,
    private cartService:CartService){}

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

        this.http.get(this.httpUrl+"product-api/list-products")
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
        this.http.get(this.httpUrl+"country-api/display-country-data").
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

      public LoginPopup():void{
        this.makeLoading=true;
        this.popupLogin=false;
        this.popupLoginComponent=true;
        setTimeout(()=>this.makeLoading=false,1000);
      }

      public onAddToCartBtnClicked():void{

        var userId:string="";

        try{
          userId=this.storage.getData().id;
        }catch(err){
          this.makeLoading=true;
          this.popupLogin=true;
          setTimeout(()=>this.makeLoading=false,1000);
        }

        const CartData={
          userId:userId,
          productId:this.productData._id,
          productName:this.productData.name,
          price:Number(this.productData.price),
          quantity:Number(this.productData.minquantity),
          imgSrc:this.productData.src,
          totalPrice:(this.productData.price*this.productData.pieces)*this.productData.minquantity,
          stock_quantity:Number(this.productData.stock_quantity - this.productData.minquantity),
          product_is_veg:this.productData.isVeg,
          product_type:this.productData.type,
          max_quantity:this.productData.maxquantity,
          min_quantity:this.productData.minquantity,
          pack_quantity:this.productData.pieces,
        }
        console.log(CartData);


        this.http.post(this.httpUrl+"cart-api/insert-cart-data",CartData).
        subscribe({
          next:(res:any)=>{
            this.toast.success(`${this.productData.name} has been successfully added to your cart.`);

            this.http.get(`${this.httpUrl}cart-api/display-user-cart-data/${userId}`).
    subscribe({
      next:(res:any)=>{
        this.cartService.addToCart(res.length);
      },
      error:(err)=>{
        console.log(err);
      }
    });
          },error:(err)=>{
            if(err.status==400)
              this.toast.info(`${this.productData.name} is already in the cart!`);

            else
            this.toast.error(`Oops! Unable to add ${this.productData.name} to your cart. Please try again.`);

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
  stock_quantity:number;
  rating:number;
  minquantity:number;
  pieces:number;
}

interface CounterSchema{
  _id:any;
  name: string;
  charge:number;
  isAvailable:boolean;
}
