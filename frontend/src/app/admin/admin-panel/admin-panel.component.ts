import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../storage.service';
import { RouterManagerService } from '../../router-manager.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
    isMenuOpen = false;
    screenWidth: number=0;
    public AdminData:AdminSchema={name:'',email:'',id:''};
    public makeLoading:boolean=false;

    constructor(private storage:StorageService, public route:RouterManagerService, private toast:ToastrService, private http:HttpClient) {
      this.screenWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        this.screenWidth = window.innerWidth;
      });
    }

    ngOnInit(): void {
      if(!this.storage.getData()){
        this.route.moveTo("/home");
        this.toast.error("Please login to continue!");
      }
      if( this.storage.getData()?.role!=="admin"){
        this.route.moveTo("/home");
        this.toast.warning("Invalid Admin!");
      }

      this.AdminData=this.storage.getData();

      const VerifyAdmin=()=>{
        this.makeLoading=true;
        this.http.post("http://localhost:8080/admin-api/check-admin",this.AdminData).
        subscribe(
          {
            next:(res:any)=>{
              // this.toast.success(res.message);
              this.makeLoading=false;
            },
            error:(err:any)=>{
              this.toast.warning(err.error.message);
              this.makeLoading=false;
              this.route.moveTo(err.error.path);
            }
          }
        )
      }

      VerifyAdmin();



    }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout():void{
    this.makeLoading=true;
    this.storage.removeData();
    this.toast.success("Logged Out Successfully!");
    this.makeLoading=false;
    this.route.moveTo("/home");
  }
}

interface AdminSchema{
  name:String;
  email:String;
  id:String;
}

