import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  constructor(private http:HttpClient,private storage:StorageService){}

  ngOnInit(): void {
    const userData:any=this.storage.getData();
    this.http.get(`http://localhost:8080/cart-api/display-user-cart-data/${userData._id}`).
    subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
