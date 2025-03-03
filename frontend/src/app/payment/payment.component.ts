import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input('ShowModal') showModal: boolean = false;
  @Input('OrderDatas') paymentData: any;
  selectedMethod: string | null = null;
  confirmModal: boolean = false;
  showPaymentModal: boolean = false;
  successPopup: boolean = false; // Added for success message

  paymentMethods = [
    { name: 'Cash on Delivery', icon: '💵', value: 'cod' },
    { name: 'Google Pay', icon: '💳', value: 'gpay' },
    { name: 'Credit/Debit Card', icon: '💠', value: 'card' }
  ];

  constructor(private http:HttpClient, private toast:ToastrService) { }

  ngOnInit(): void { }


  InsertOrderData(paymentType:string):void{
    this.http.post('http://localhost:8080/order-api/insert-order-data',{...this.paymentData.userInfo,...this.paymentData.costData,cartData:this.paymentData.cartData,paymentType}).
    subscribe(
      {
        next:(res)=>{
          this.toast.success("Order Placed Successfully!");
          this.successPopup = true;
        },
        error:(err)=>{
          console.log(err);
        }
      }
    );
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    setTimeout(()=>window.location.reload(),1000);
  }

  confirmOrder() {
    if (this.selectedMethod === 'cod') {

      console.log(this.paymentData);

      this.InsertOrderData("Cash on Delivery");

      this.closeAllModals(); // Close all modals
    } else {
      console.log("Selected Payment Method:", this.selectedMethod);
    }
  }

  proceedToPayment() {
    this.showPaymentModal = true;
  }

  closeConfirmModal() {
    this.confirmModal = false;
    setTimeout(()=>window.location.reload(),1000);
  }

  closeAllModals() {
    this.showModal = false;
    this.showPaymentModal = false;
    this.confirmModal = false;
    setTimeout(()=>window.location.reload(),1000);
  }

  closeSuccessPopup() {
    this.successPopup = false;
    setTimeout(()=>window.location.reload(),1000);
  }
}
