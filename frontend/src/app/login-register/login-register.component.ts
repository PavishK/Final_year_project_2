import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  @Input('loginOrRegister') public loginRegisterVisiability:boolean=true;
  constructor(private http:HttpClient, private toast:ToastrService){}

  loginRegisterHandler():void{
    this.loginRegisterVisiability=!this.loginRegisterVisiability;
  }

  loginHandler(data:NgForm):void{
    if(data.valid){
      this.http.post("http://localhost:8080/api/user/login",data.value,{withCredentials:true})
      .subscribe(
        (res:any)=>{
          this.toast.success(res.message)
        },
        (err)=>this.toast.error(err.error.message)
      )
    }
    else this.toast.error("Please fill out the fields.");
  }

  registerHandler(data:NgForm):void{
    if(data.valid){
      this.http.post("http://localhost:8080/api/user/register",data.value,{withCredentials:true})
      .subscribe(
        (res:any)=>{
          this.toast.success(res.message)
        },
        (err)=>this.toast.error(err.error.message)
      )
    }
    else this.toast.error("Please fill out the fields.");
  }


}
