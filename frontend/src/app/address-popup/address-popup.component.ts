import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-address-popup',
  templateUrl: './address-popup.component.html',
  styleUrls: ['./address-popup.component.css']
})
export class AddressPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<AddressPopupComponent>, private route:RouterManagerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectAddress(address: any) {
    const addressData={
      name:address.fullname,
      houseno:address.houseNo,
      roadno:address.roadNo,
      city: address.city,
      state: address.state+" - "+address.pinCode,
    }
    const info={
      userId:address.userId,
      type:address.addressType,
      phno:address.phoneNumber,
      address:Object.values(addressData).join(', '),
    }
    this.dialogRef.close(info);
  }

  closePopup() {
    this.dialogRef.close(null);
  }

  manageAddress():void{
    this.closePopup();
    this.route.moveTo('user/saved-address');
  }
}
