import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public mobile_menu_view:boolean=false;
  public isLoggedIn:boolean=false;

  triggerMenuBtn():void{
    this.mobile_menu_view=!this.mobile_menu_view;
  }


}
