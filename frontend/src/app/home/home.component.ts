import { Component } from '@angular/core';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router:RouterManagerService){}

  handleMoreBtn():void{
    this.router.moveTo('/about');
  }

  handleProductsBtn():void{
    this.router.moveTo('/products');
  }
  handleReviewsBtn():void{
    this.router.moveTo("/reviews");
  }

}
