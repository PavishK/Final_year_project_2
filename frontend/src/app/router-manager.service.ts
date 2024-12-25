import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterManagerService {

  constructor(private router:Router) { }

  moveTo( path:String):void{
    this.router.navigate([path]);
  }
  
}
