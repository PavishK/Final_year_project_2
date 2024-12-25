import { StorageService } from './../storage.service';
import { Component,OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

    constructor(private storage:StorageService, private http:HttpClient,private toast:ToastrService){}

  public mobile_menu_view:boolean=false;
  public isLoggedIn?:boolean;
  public account_menu_view:boolean=false;
  protected userData?:any;
  public makeLoading:boolean=false;

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
        navbar.style.top = '-78px';
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



  }

  private sessionCheck():void{
    this.http.get("http://localhost:8080/api/session-protector",{withCredentials:true})
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
    this.makeLoaderVisible();
  }

}
