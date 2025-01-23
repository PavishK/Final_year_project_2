import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-product-details',
  templateUrl: './display-product-details.component.html',
  styleUrl: './display-product-details.component.css'
})
export class DisplayProductDetailsComponent implements OnInit {

  public productData:any=[];
  public makeLoading:boolean=false;
  constructor(private route:ActivatedRoute){}

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
          this.productData=params;
        }
      );
  }

}
