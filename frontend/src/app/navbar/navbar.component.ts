import { StorageService } from './../storage.service';
import { Component,OnInit } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

    constructor(private storage:StorageService){}

  public mobile_menu_view:boolean=false;
  public isLoggedIn?:boolean;
  public account_menu_view:boolean=false;
  protected userData?:any;
  public makeLoading:boolean=false;

  public makeLoaderVisible():void{
    this.makeLoading=true;
    setInterval(()=>{
      this.makeLoading=false;
    },2000)
  }

  ngOnInit(): void {

    //Openening loading...
    this.makeLoaderVisible();

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


  if(this.storage.getData()){
    this.isLoggedIn=true;
    this.userData=this.storage.getData();
  }
  else{
    this.isLoggedIn,this.account_menu_view,this.showModal,this.loginRegisterView=false;
  }


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

  closePopUp(data:any):void{
    this.showModal=data;
  }


  protected UserActive(isLogg:boolean):void{
    this.makeLoaderVisible();
    if(this.storage.getData()){
      this.isLoggedIn=isLogg;
      this.userData=this.storage.getData();
    }
    else{
      this.isLoggedIn,this.account_menu_view,this.showModal,this.loginRegisterView=false;
    }
  }

  protected clearUserData():void{
    this.makeLoaderVisible();
    this.storage.removeData();
    this.isLoggedIn=false;
    this.makeLoaderVisible();
  }

}
