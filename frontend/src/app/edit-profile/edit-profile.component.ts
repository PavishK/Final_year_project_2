import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  constructor(private http: HttpClient, private storage: StorageService, private toast: ToastrService, private route:RouterManagerService) { }

  public profile: ProfileSchema = {
    name: '',
    fullname: '',
    email: '',
    phno: '',
    country: '',
    pin_code: '',
  };

  public id: string = "";
  otp: string[] = ["", "", "", ""];
  private fp_otp:string="";
  public makeLoading=false;

  showForgotPasswordPopup = false;
  showUpdatePasswordPopup = false;
  showUpdateConfirmPopup = false;
  newPassword = "";
  confirmPassword = "";

  ngOnInit(): void {
    const UserData = this.storage.getData();
    if(UserData===null){
      this.route.moveTo('/home');
      this.toast.warning("Please Login to Continue!");
    }


    if (UserData.id) {
      this.makeLoading=true;
      this.http.get(`http://localhost:8080/api/edit-profile/${UserData.id}`).subscribe({
        next: (res: any) => {
          this.profile = res.userData;
          this.id = UserData.id;
          this.makeLoading=false;
        },
        error: () => {
          this.toast.error("Unable to get data. Please try login again!");
          this.makeLoading=false;
        }
      });
    }
  }

  validateInput(): boolean {
    if (!this.profile.name.trim()) {
      this.toast.error("Name is required");
      return false;
    }
    if (!this.profile.fullname.trim()) {
      this.toast.error("Full name is required");
      return false;
    }
    if (!this.profile.email.trim() || !this.profile.email.includes('@')) {
      this.toast.error("Valid email is required");
      return false;
    }
    if (!this.profile.phno.trim() || !/^[0-9]{10}$/.test(this.profile.phno)) {
      this.toast.error("Valid 10-digit phone number is required");
      return false;
    }
    if (!this.profile.country.trim()) {
      this.toast.error("Country is required");
      return false;
    }
    if (!this.profile.pin_code.trim() || !/^\d{6}$/.test(this.profile.pin_code)) {
      this.toast.error("Valid 6-digit pin code is required");
      return false;
    }
    else{
      this.makeLoading=true;
      this.http.post(`http://localhost:8080/country-api/valid-pincode`,{pin:this.profile.pin_code}).
      subscribe({
        next:(res)=>{
          this.toast.success("Valid PIN Code");
          this.makeLoading=false;
        },
        error:(err)=>{
          this.toast.error(err.error.message);
          this.showUpdateConfirmPopup=false;
          this.makeLoading=false;

        },
      });

    }
    return true;

  }


  onSubmit() {
    if (this.validateInput()) {
      this.showUpdateConfirmPopup = true;
    }
  }

  forgotPassword() {
    this.makeLoading=true;
    this.http.post('http://localhost:8080/api/forgot-password/send-otp',{email:this.profile.email}).
    subscribe({
      next:(res:any)=>{
        this.toast.success("OTP sent to your email");
        this.showForgotPasswordPopup=true;
        this.fp_otp=res.otp;
        this.makeLoading=false;
      },
      error:(err)=>{
        this.toast.error(err.error.message);
        this.showForgotPasswordPopup=false;
        this.makeLoading=false;
      }
    });

  }

  closePopup() {
    this.showForgotPasswordPopup = false;
    this.showUpdateConfirmPopup = false;
    this.showUpdatePasswordPopup = false;
  }

  updateUserData(): void {
    if (this.validateInput()) {
      this.makeLoading=true;
      this.http.put(`http://localhost:8080/api/user-profile-update/${this.id}`, this.profile).subscribe({
        next: (res: any) => {
          this.toast.success(res.message);
          this.showUpdateConfirmPopup = false;
          this.makeLoading=false;
        },
        error: (err) => {
          console.log("Update failed:", err);  // Debugging error
          this.toast.error("Update failed. Please try again!");
          this.makeLoading=false;
        }
      });

    }
  }

  // OTP Animation & Operation
  moveToNext(event: any, nextId: string) {
    if (event.target.value) {
      const nextInput = document.getElementById(nextId) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  verifyOtp() {
    const enteredOtp = this.otp.join(""); // Combine all OTP digits

    if (enteredOtp.length === 4) {

      if(this.fp_otp==enteredOtp)
      {
        this.toast.success("OTP Verified Successfully!");
        this.showUpdatePasswordPopup = true;
      }
      else{
        this.toast.error("Invalid OTP");
        this.closePopup();
      }

    } else {
      console.log("Invalid OTP: Please enter a 4-digit OTP.");
      this.toast.error("Invalid OTP. Please enter all 4 digits.");
    }
  }


  changePassword():void{
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Passwords do not match. Please try again.', 'Error');
      return;
    }
    if(this.newPassword.length<8){
      this.toast.error('Password should be at least 8 characters long.');
      return;
    }
    if(this.newPassword.length>20){
      this.toast.error('Password should not be more than 20 characters long.');
      return;
    }
    this.makeLoading=true;
    this.http.put('http://localhost:8080/api/user-password-update',{email:this.profile.email,password:this.newPassword}).
    subscribe({
      next:(res:any)=>{
        this.toast.success(res.message);
        this.showUpdatePasswordPopup=false;
        this.closePopup();
        this.makeLoading=false;
      },
      error:(err)=>{
       this.toast.error(err.error.message);
       this.makeLoading=false;
      }
    });
  }
}

interface ProfileSchema {
  name: string;
  fullname: string;
  email: string;
  phno: string;
  country: string;
  pin_code: string;
}
