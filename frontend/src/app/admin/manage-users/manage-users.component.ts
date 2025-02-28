import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];

  editingUser: User | null = null;
  confirmPopup:boolean=false;
  deleteUserName:deleteSchema={id:'',name:''};
  makeLoading:boolean=false;

  constructor(
    private http:HttpClient,
    private storage:StorageService,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
    this.makeLoading=true;
    this.http.get<any[]>(`http://localhost:8080/api/display-users/${this.storage.getData().id}`).
    subscribe({
      next:(res:any)=>{
        //this.toast.success(res.message);
        this.users = res.data;
        this.makeLoading=false;
      },
      error:(err)=>{
        console.log(err);
        this.makeLoading=false;
      }
    })
  }

  openEditPopup(user: User) {
    this.editingUser = { ...user };
  }

  saveUser() {
    if (this.editingUser) {
      this.users = this.users.map(user => user._id === this.editingUser!._id ? this.editingUser! : user);
      const updateData={
        id:this.editingUser._id,
        role:this.editingUser.role,
      }
      this.makeLoading=true;
      this.http.post('http://localhost:8080/api/user-role-update',updateData).
      subscribe(
        {
          next:(res:any)=>{
            this.toast.success(res.message);
         this.makeLoading=false;
          },
          error:(err)=>{
          this.toast.error(err.error.message);
     this.makeLoading=false;
          }
        }
      )

      this.editingUser = null;
    }
  }

  deleteUser(id: string,name:string) {

    this.deleteUserName={id:id,name:name};
    this.confirmPopup=true;
  }

  removeUser():void{
    this.makeLoading=true;
    this.users = this.users.filter(user => user._id !== this.deleteUserName.id);
    this.http.delete(`http://localhost:8080/api/delete-user/${this.deleteUserName.id}`).
    subscribe(
      {
        next:(res:any)=>{

          this.toast.success(res.message);
          this.confirmPopup=false;
          this.makeLoading=false;
        },
        error:(err:any)=>{
          this.toast.error(err.error.message);
          this.confirmPopup=false;
          this.makeLoading=false;
        }
      }
    )
    this.confirmPopup=false;
  }

  ResetPassword(data:User):void{
    this.makeLoading=true;
    this.http.post('http://localhost:8080/api/user-password-reset',{email:data.email,id:data._id}).
    subscribe(
      {
        next:(res:any)=>{
          this.makeLoading=false;
          this.toast.success(res.message);
        },
        error:(err:any)=>{
          this.toast.error(err.error.message);
          this.makeLoading=false;
        }
      }
    )
  }
}

interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
  role: string;
  password?: string;
}

interface deleteSchema{
  id:String;
  name:String;
}
