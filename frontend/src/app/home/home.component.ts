import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { RouterManagerService } from '../router-manager.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {



  public Counter:AnimatedCounter=new AnimatedCounter();
  constructor(private router:RouterManagerService, private toast:ToastrService, private http:HttpClient){
    this.contact=new ContactUs(toast,http);

  }
  public contact:ContactUs;


  @ViewChild('counterElement') counterElement!: ElementRef;
  countersStarted = false;

  @HostListener('window:scroll', [])
  onScroll() {
    const rect = this.counterElement.nativeElement.getBoundingClientRect();
    if (!this.countersStarted && rect.top <= window.innerHeight && rect.bottom >= 0) {
      this.countersStarted = true;
      this.Counter.animateValue('value1',100,1200);
      this.Counter.animateValue('value2',500,1200);
      this.Counter.animateValue('value3',4,1200);
    }
  }

  ngOnInit(): void {}

}

//Animated Counter Increment

class AnimatedCounter {

  public value1:number=0;
  public value2:number=0;
  public value3:number=0;


  animateValue(property: 'value1' | 'value2' | 'value3', target: number, duration: number) {
    const stepTime = Math.abs(Math.floor(duration / target));
    const interval = setInterval(() => {
      this[property]++;
      if (this[property] >= target) {
        clearInterval(interval);
      }
    }, stepTime);
  }


}

class ContactUs{
  constructor(private toast:ToastrService, private http:HttpClient){}
  public makeLoad=false;

  handleSubmitBtn(data:NgForm):void{
    if(data.valid){
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(data.value.email))
        this.toast.error('Invalid Email');
      else if(data.value.message.length<20)
        this.toast.error('Message should be at least 20 characters long');
      else if(data.value.name.length<5)
        this.toast.error('Name should be at least 5 characters long');
      else{
      this.makeLoad=true;
      this.http.post(environment.httpUrl+"api/contactus/send-mail",data.value)
      .subscribe(
        (res:any)=>{
          this.toast.success(res.message);
          this.makeLoad=false;
        },
        (err:any)=>{
          this.toast.error(err.error.message);
          this.makeLoad=false;
        },
      )

    }
  }
    else
    this.toast.error("Fill out the fields!");
  }
}
