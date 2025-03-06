import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.css']
})
export class CardPaymentComponent implements OnChanges {
  @Input('PaymentData') paymentData: any = {};
  @Input('ShowCardModel') showPopup: boolean = false;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;
  clientSecret: string = '';
  loading: boolean = false;

  successPopup: boolean = false;
  errorPopup: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  async initializeStripe() {
    if (!this.stripe) {
      this.stripe = await loadStripe('pk_test_51QxMYX4GITP5kPk7eCuCIMW5ZwjUWQKXc8wdgkXycxMkkbyAVQHUya3iJdgi57Cbs98vgDGGL9bV7jrLz4SHO7jI00EhbrnbDw');
    }

    if (this.stripe && !this.elements) {
      this.elements = this.stripe.elements();
      this.cardNumber = this.elements.create('cardNumber', { style: { base: { fontSize: '18px', color: '#333' } } });
      this.cardExpiry = this.elements.create('cardExpiry', { style: { base: { fontSize: '18px', color: '#333' } } });
      this.cardCvc = this.elements.create('cardCvc', { style: { base: { fontSize: '18px', color: '#333' } } });

      this.cardNumber.mount('#card-number');
      this.cardExpiry.mount('#card-expiry');
      this.cardCvc.mount('#card-cvc');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showPopup'] && this.showPopup) {
      this.initializeStripe();
    }
  }

  InsertOrderData(paymentType: string): void {
    this.http.post('http://localhost:8080/order-api/insert-order-data', {
      ...this.paymentData.userInfo,
      ...this.paymentData.costData,
      cartData: this.paymentData.cartData,
      paymentType,
      upiId:"",
    }).subscribe({
      next: () => {
        this.toastr.success("Order Placed Successfully!");
        this.successPopup = true;
       this.showPopup=false;
      },
      error: (err) => {
        console.error(err);
        this.errorPopup=true;
        this.toastr.error("Order placement failed!");
      }
    });
  }

  createPaymentIntent() {
    if (!this.paymentData?.costData?.total) {
      this.toastr.error("Invalid payment data");
      this.errorPopup = true;
      return;
    }



    this.loading = true;
    this.http.post<{ clientSecret: string }>('http://localhost:8080/payment-api/card-payment', this.paymentData)
      .subscribe(
        response => {
          this.clientSecret = response.clientSecret;

          if (!this.stripe || !this.clientSecret || !this.cardNumber) {
            this.toastr.error("Payment initialization failed!");
            this.errorPopup = true;
            this.loading = false;
            return;
          }

          this.stripe.confirmCardPayment(this.clientSecret, {
            payment_method: { card: this.cardNumber }
          }).then(({ paymentIntent, error }) => {
            this.loading = false;
            if (error) {
              this.toastr.error("Payment Failed: " + error.message);
              this.errorPopup = true;
            } else if (paymentIntent?.status === 'succeeded') {
              this.toastr.success("Payment Successful!");
              this.InsertOrderData("Card Payment");
            }
          });
        },
        error => {
          this.loading = false;
          this.toastr.error("Payment failed: " + error.message);
          this.errorPopup = true;
        }
      );
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
    this.errorPopup=true;
  }
}
