import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { RouterManagerService } from '../router-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.component.html',
  styleUrls: ['./saved-address.component.css']
})
export class SavedAddressComponent implements OnInit {
  addresses: any[] = [];
  states: string[] = [];
  cities: string[] = [];

  newAddress = {
    _id: '',
    fullname: '',
    phoneNumber: '',
    pinCode: '',
    state: '',
    city: '',
    houseNo: '',
    roadNo: '',
    addressType: 'House'
  };

  isEditMode: boolean = false;
  isAddingNewAddress: boolean = false;
  currentAddress: any;
  pinCodeMessage: string = '';
  pinCodeError: string = '';
  makeLoadind:boolean=false;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private route: RouterManagerService,
    private toast: ToastrService,
    private navigate:Location,
  ) {}

  ngOnInit(): void {
    const { id } = this.storage.getData();
    if (!id) {
      this.toast.info("Please login again!");
      setTimeout(() => this.route.moveTo('home'), 1200);
      return;
    }
    this.fetchAddresses(id);
  }

  fetchAddresses(userId: string) {
    this.makeLoadind=true;
    this.http.get(`http://localhost:8080/address-api/user/display-user-address/${userId}`)
      .subscribe({
        next: (res: any) => this.addresses = res.data,
        error: () => {
          this.addresses = [];
          this.makeLoadind=false;
          //this.toast.error("Failed to fetch addresses");
        }
      });
      this.makeLoadind=false;
  }

  saveNewAddress() {
    if (!this.validatePinCode()) return;

    if (this.isAddingNewAddress) {
      const data={
        userId: this.storage.getData().id,
        fullname:this.newAddress.fullname,
        phoneNumber:this.newAddress.phoneNumber,
        state:this.newAddress.state,
        city:this.newAddress.city,
        addressType: this.newAddress.addressType,
        pinCode: this.newAddress.pinCode,
        houseNo: this.newAddress.houseNo,
        roadNo: this.newAddress.roadNo,

      }
      this.makeLoadind=true;
      this.http.post('http://localhost:8080/address-api/user/insert-user-address',data).
      subscribe({
        next:(res)=>{
          this.toast.success("Address Saved Successfully!");
          this.makeLoadind=false;
        },
        error:(err)=>{
          this.toast.error("Error in Saving Address.Please Try again!");
          this.makeLoadind=false;
        }
      });

      this.newAddress._id = this.generateUniqueId();
      this.addresses.push({ ...this.newAddress });
      // this.toast.success('New Address Saved!');
    } else {
      const index = this.addresses.findIndex(addr => addr._id === this.currentAddress._id);
      if (index !== -1) {
        this.addresses[index] = { ...this.newAddress };
        this.toast.success('Address Updated!');
      }
    }
    this.cancelEdit();
  }

  toggleEditMode(isNew: boolean, address?: any) {
    this.isEditMode = true;
    this.isAddingNewAddress = isNew;
    this.pinCodeMessage = '';
    this.pinCodeError = '';

    if (isNew) {
      this.newAddress = {
        _id: '',
        fullname: '',
        phoneNumber: '',
        pinCode: '',
        state: '',
        city: '',
        houseNo: '',
        roadNo: '',
        addressType: 'House'
      };
    } else {
      this.currentAddress = address;
      this.newAddress = { ...address };
      this.fetchCityStateFromPinCode();
    }
  }

  UpdateBtn():void{
    this.makeLoadind=true;
    this.http.put(`http://localhost:8080/address-api/user/update-user-address/${this.newAddress._id}`,this.newAddress).
    subscribe({
      next:(res)=>{
        this.makeLoadind=false;
      },
      error:(err)=>{
        this.toast.error("Unable to update the address!");
        this.makeLoadind=false;
      }
    })
  }

  cancelEdit() {
    this.isEditMode = false;
    this.isAddingNewAddress = false;
    this.newAddress = {
      _id: '',
      fullname: '',
      phoneNumber: '',
      pinCode: '',
      state: '',
      city: '',
      houseNo: '',
      roadNo: '',
      addressType: 'House'
    };
    this.pinCodeMessage = '';
    this.pinCodeError = '';
  }

  deleteAddress(id: string): void {
    this.makeLoadind=true;
    this.addresses = this.addresses.filter(ele => ele._id !== id);
    this.http.delete(`http://localhost:8080/address-api/user/delete-user-address/${id}`).
    subscribe({
      next:(res:any)=>{
        this.toast.success(res.message);
        this.makeLoadind=false;
      },
      error:(err)=>{
        this.toast.error("Unable to delete Address!");
        this.makeLoadind=false;
      }
    })
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  validatePinCode(): boolean {
    if (!/^\d{6}$/.test(this.newAddress.pinCode)) {
      this.pinCodeError = "Invalid PIN Code!";
      this.pinCodeMessage = '';
      return false;
    }
    this.pinCodeError = '';
    this.fetchCityStateFromPinCode();
    return true;
  }

  fetchCityStateFromPinCode() {
    this.makeLoadind=true;
    this.http.post('http://localhost:8080/country-api/get-city-state-name', { pin: this.newAddress.pinCode })
      .subscribe({
        next: (res: any) => {
          this.states = res.state;
          this.cities = res.city;
          this.newAddress.state = res.state.length > 0 ? res.state[0] : '';
          this.newAddress.city = res.city.length > 0 ? res.city[0] : '';
          this.pinCodeMessage = `Valid PIN Code!`;
          this.makeLoadind=false;
        },
        error: () => {
          this.pinCodeError = "Invalid PIN Code!";
          this.pinCodeMessage = '';
          this.makeLoadind=false;
        }
      });
  }
  goBack():void{
    this.navigate.back();
  }
}
