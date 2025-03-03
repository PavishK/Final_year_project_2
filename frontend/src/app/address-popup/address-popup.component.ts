import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-address-popup',
  templateUrl: './address-popup.component.html',
  styleUrls: ['./address-popup.component.css']
})
export class AddressPopupComponent {

  public makeLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddressPopupComponent>,
    private route: RouterManagerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectAddress(address: any) {
    this.makeLoading = true;

    const UserAddress = {
      userId: address.userId,
      userName: address.fullname,
      address: `${address.houseNo}, ${address.roadNo}, ${address.city}, ${address.state} - ${address.pinCode}`,
      phno: address.phoneNumber,
      addressType: address.addressType,
    };

    console.log(address);

    setTimeout(() => {  // Simulate async behavior if needed
      this.dialogRef.close(UserAddress);
      this.makeLoading = false;
    }, 500);
  }

  closePopup() {
    this.makeLoading = true;
    setTimeout(() => {
      this.dialogRef.close(null);
      this.makeLoading = false;
    }, 300);
  }

  manageAddress(): void {
    this.makeLoading = true;
    this.closePopup();

    setTimeout(() => {
      this.route.moveTo('user/saved-address');
      this.makeLoading = false;
    }, 500);
  }
}
