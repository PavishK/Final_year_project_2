import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})

export class ProductCountService {

  constructor(private http:HttpClient, private toast:ToastrService) { }

  getIntemsCount(products:any[]):any[]{

    return  [
      [
        { id: 1, src: "icons/dish.svg", name: "all menu", items: products.length },
        { id: 2, src: "icons/bread.svg", name: "bread", items: products.filter((ele)=>ele.type=="bread").length },
        { id: 3, src: "icons/cake.svg", name: "cake", items: products.filter((ele)=>ele.type=="cake").length },
        { id: 4, src: "icons/rusk.svg", name: "rusk", items: products.filter((ele)=>ele.type=="rusk").length},
        { id: 5, src: "icons/biscuit.svg", name: "biscuit", items: products.filter((ele)=>ele.type=="biscuit").length },
      ]
    ];
  }

}
