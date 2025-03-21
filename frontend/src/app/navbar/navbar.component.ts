import { StorageService } from './../storage.service';
import { Component,OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterManagerService } from '../router-manager.service';
import { CartService } from '../cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

    constructor(private storage:StorageService, private http:HttpClient,private toast:ToastrService,private route:RouterManagerService, private cartService:CartService){}

  public mobile_menu_view:boolean=false;
  public isLoggedIn?:boolean;
  public account_menu_view:boolean=false;
  protected userData?:any;
  public makeLoading:boolean=false;

  public cartCount:number=0;

  //Nav Bar Animation
  prevScrollPos: number = window.pageYOffset;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPos = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (this.prevScrollPos > currentScrollPos) {
        navbar.style.top = '0';
      } else {
        navbar.style.top = '-107px';
      }
    }
    this.prevScrollPos = currentScrollPos;
  }

  public makeLoaderVisible():void{
    this.makeLoading=true;
    setInterval(()=>{
      this.makeLoading=false;
    },2000)
  }

  public OnSearchBtnClick():void{
    this.route.moveTo('/products');
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

  if(this.isLoggedIn){  this.sessionCheck();}


  this.cartService.cartCount$.subscribe(count=>{
    this.cartCount=count;
  });

  this.http.get(`${environment.httpUrl}cart-api/display-user-cart-data/${this.userData.id}`).
    subscribe({
      next:(res:any)=>{
        this.cartCount=res.length;
      },
      error:(err)=>{
        console.log(err);
      }
    });

  }

  private sessionCheck():void{
    this.http.get(environment.httpUrl+"api/session-protector",{withCredentials:true})
    .subscribe(
      (res:any)=>{

        if(res.data.access){
          this.storage.setData(res.userData);
        }
        else{
          this.storage.removeData();
          this.toast.error(res.message);
          this.isLoggedIn=false;
        }
      },
      (err)=>{
        this.storage.removeData();

        this.toast.error(err.error.message);
        this.isLoggedIn=false;
      },
    )
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
    this.makeLoaderVisible();
    this.loginRegisterView=true;
    this.showModal = !this.showModal;
  }
  openRegisterPopup(){
    this.makeLoaderVisible();
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
    setTimeout(()=>window.location.reload(),850);
    this.makeLoaderVisible();
  }



}
