import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../storage.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  @Input('loginOrRegister') public loginRegisterVisiability:boolean=true;

  @Output() popupCloser=new EventEmitter<boolean>();

  @Output() userActive=new EventEmitter<boolean>();

  constructor(private http:HttpClient, private toast:ToastrService,private storage:StorageService){}

  public setLoading:boolean=false;



  loginRegisterHandler():void{
    this.loginRegisterVisiability=!this.loginRegisterVisiability;
  }

  loginHandler(data:NgForm):void{

    if(data.valid){
      this.setLoading=true;
      this.http.post(environment.httpUrl+"api/user/login",data.value,{withCredentials:true})
      .subscribe(
        (res:any)=>{
          this.setLoading=false;
          this.toast.success(res.message);
          this.popupCloser.emit(false);
          this.storage.setData(res.data);
          this.userActive.emit(true);
          setTimeout(()=>window.location.reload(),800);
        },
        (err)=>{
          this.setLoading=false;
          this.toast.error(err.error.message)
        }
      )
    }
    else this.toast.error("Please fill out the fields.");
  }

  registerHandler(data:NgForm):void{
    if(data.valid){
      this.setLoading=true;
      this.http.post(environment.httpUrl+"api/user/register",data.value,{withCredentials:true})
      .subscribe(
        (res:any)=>{
          this.setLoading=false;
          this.toast.success(res.message);
          this.popupCloser.emit(false);
          console.log(res.data);
          this.storage.setData(res.data);
          this.userActive.emit(true);
        },
        (err)=>{
          this.setLoading=false;
          this.toast.error(err.error.message);
        }
      )
    }
    else this.toast.error("Please fill out the fields.");
  }


}
