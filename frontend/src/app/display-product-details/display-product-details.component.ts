import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-display-product-details',
  templateUrl: './display-product-details.component.html',
  styleUrl: './display-product-details.component.css'
})
export class DisplayProductDetailsComponent implements OnInit {

  public productData:any=[];
  public makeLoading:boolean=false;
  public allProductData:ProductSchema[]=[];
  public matchColor: any = { bread: 'red', cake: 'gray', biscuit: 'orange', rusk: 'green' };
  public popUpState:boolean=false;
  public popUpDescription:boolean=false;
  constructor(private route:ActivatedRoute, private toast:ToastrService,private http:HttpClient, private routeMoveTo:RouterManagerService){}

  public MakeLoadingVisible():void{
    this.makeLoading=true;
    setTimeout(()=>{
      this.makeLoading=false;
    },1200);

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
              console.log(this.allProductData);
            },
            error: (err:any) => this.toast.error(err.error.message)
          });
      }

      public onClickProduct(data:any):void{
        this.routeMoveTo.moveWithData("display-product-details/product",data);

      }

      public closeOrOpenStatePopup(){
        this.popUpState=!this.popUpState;
      }
      public closeOrOpenDescriptionPopUp(){
        this.popUpDescription=!this.popUpDescription;
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
}
