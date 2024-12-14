import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


  public mobile_menu_view:boolean=false;
  public isLoggedIn:boolean=false;
  ngOnInit(): void {

    //menu close after 680

    window.addEventListener('resize',()=>{
      if(window.innerWidth>680)
        this.mobile_menu_view=false;
    });

  }

  triggerMenuBtn():void{
    this.mobile_menu_view=!this.mobile_menu_view;
  }


}
