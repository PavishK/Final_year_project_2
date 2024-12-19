import { Component,OnInit } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


  public mobile_menu_view:boolean=false;
  public isLoggedIn:boolean=false;
  public account_menu_view:boolean=false;

  ngOnInit(): void {

    //menu close after 680

    window.addEventListener('resize',()=>{
      if(window.innerWidth>680)
        this.mobile_menu_view=false;
      else if(window.innerWidth<680)
        this.account_menu_view=false;
    });

    window.addEventListener('scroll',()=>{
      this.mobile_menu_view=false;
      this.account_menu_view=false;
  });

  }


  triggerAccountBtn():void{
    this.account_menu_view=!this.account_menu_view;
  }

  triggerMenuBtn():void{
    this.mobile_menu_view=!this.mobile_menu_view;
  }

  public showModal:boolean=false;
  public loginRegisterView:boolean=false;

  openLoginPopup(){
    this.loginRegisterView=true;
    this.showModal = !this.showModal;
  }
  openRegisterPopup(){
    this.loginRegisterView=false;
    this.showModal = !this.showModal;
  }

}
