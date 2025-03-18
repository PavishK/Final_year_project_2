import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnChanges {

  @Input('ShowModal') showModal: boolean = false;
  @Input('OrderDatas') paymentData: any;

  selectedMethod: string | null = null;
  confirmModal: boolean = false;
  showPaymentModal: boolean = false;
  successPopup: boolean = false;
  errorPopup: boolean = false;
  upiModel: boolean = false;

  paymentMethods = [
    { name: 'Cash on Delivery', icon: '💵', value: 'cod' },
    { name: 'Google Pay', icon: '💳', value: 'gpay' },
    { name: 'Credit/Debit Card', icon: '💠', value: 'card' }
  ];

  // UPI Payment Details
  receiverUpiId: string = 'pavishk2005@oksbi';
  payerUpiId: string = '';
  upiUrl: string = '';
  isMobile: boolean = false;
  qrCodeUrl: string = ''; // Store the QR Code URL


  //Card Payment
  showCardModel:boolean=false;

  constructor(private http: HttpClient, private toast: ToastrService) {}

  ngOnInit(): void {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  // Runs whenever @Input() properties change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentData'] && this.paymentData && this.paymentData.costData) {
      console.log("Payment Data Updated: ", this.paymentData);
      this.generateUPIUrl(this.paymentData.costData.total);
    }
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  confirmOrder() {
    if (this.selectedMethod === 'cod') {
      this.InsertOrderData('Cash on Delivery');
    }
    else if (this.selectedMethod === 'gpay') {
      this.upiModel = true;
    }
    else if (this.selectedMethod === 'card') {
      this.showCardModel=true;
      this.closeAllModals();
    }
  }

  proceedToPayment() {
    this.showPaymentModal = true;
  }

  closeConfirmModal() {
    this.confirmModal = false;
  }

  closeAllModals() {
    this.showModal = false;
    this.showPaymentModal = false;
    this.confirmModal = false;
    this.upiModel = false;
  }

  closeSuccessPopup() {
    this.successPopup = false;
  }

  closePayment(): void {
    this.errorPopup = true;
    this.upiModel = false;
    this.closeAllModals();
  }

  // Insert Order into Database
  InsertOrderData(paymentType: string): void {
    this.http.post(environment.httpUrl+'order-api/insert-order-data', {
      ...this.paymentData.userInfo,
      ...this.paymentData.costData,
      cartData: this.paymentData.cartData,
      paymentType,
      upiId:this.payerUpiId,
    }).subscribe({
      next: () => {
        this.toast.success("Order Placed Successfully!");
        this.successPopup = true;
        this.closeAllModals();
      },
      error: (err) => {
        console.error(err);
        this.toast.error("Order placement failed!");
      }
    });
  }

  // Generate UPI Payment URL
  generateUPIUrl(amt: number | string) {
    this.upiUrl = `upi://pay?pa=${this.receiverUpiId}&pn=SMT&tn=OrderPayment&am=${amt}&cu=INR`;

    // Generate QR Code for Laptops
    if (!this.isMobile) {
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.upiUrl)}`;
    }
  }

  // Redirect to UPI App on Mobile
  redirectToGPay() {
    if (!this.payerUpiId) {
      this.toast.error('Please enter your UPI ID');
      return;
    }

    if (this.isMobile) {
      window.location.href = this.upiUrl;
    }
  }

  // Confirm Payment
  confirmPayment() {
    if (!this.payerUpiId) {
      this.toast.error("UPI ID needed!");
    }
    else if(!/^\w+@\w+$/.test(this.payerUpiId)){
      this.toast.error("Invalid UPI ID!");
    }
    else {
      this.toast.success("Payment Confirmed!");
      this.InsertOrderData("Google Pay");
      this.closeAllModals();
    }
  }
}
