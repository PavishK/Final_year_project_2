import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ToastrService } from 'ngx-toastr';
import { RouterManagerService } from '../router-manager.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: OrderDataSchema[] = [];
  receiptData: ReceiptDataSchema | null = null;
  makeLoading: boolean = false;
  isModalOpen = false;
  cancelReason = '';
  selectedOrder: OrderDataSchema | null = null;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private toast: ToastrService,
    private router: RouterManagerService
  ) {}

  ngOnInit(): void {
    this.makeLoading = true;
    const userData = this.storage.getData();
    if (!userData) {
      this.toast.error('Please login to view orders', 'Access Denied');
      this.router.moveTo('/home');
      this.makeLoading = false;
      return;
    }

    this.http.get<OrderDataSchema[]>(`http://localhost:8080/order-api/get-user-order-data/${userData.id}`)
      .subscribe({
        next: (res: any) => {
          this.orders = res;
          if (this.orders.length === 0) {
            this.toast.info('No orders found. Start shopping now!', 'No Orders');
          } else {
            this.toast.success('Orders loaded successfully!', 'Success');
          }
          this.makeLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to fetch orders. Please try again.', 'Error');
          this.makeLoading = false;
        }
      });
  }

  downloadReceipt(orderId: string): void {
    this.makeLoading = true;
    const selectedOrder = this.orders.find(order => order._id === orderId);
    if (!selectedOrder) {
      this.toast.error('Order not found', 'Error');
      this.makeLoading = false;
      return;
    }

    this.receiptData = {
      _id: selectedOrder._id,
      userName: selectedOrder.userName,
      cartData: selectedOrder.cartData,
      userId: selectedOrder.userId,
      subtotal: selectedOrder.subtotal,
      total: selectedOrder.total,
      shipping: selectedOrder.shipping,
      discount: selectedOrder.discount,
      createdAt: selectedOrder.createdAt
    };

    const doc = new jsPDF();

    // Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.text('SRI MURUGAN BISCUIT BAKERY', 50, 15);
    doc.setFontSize(10);
    doc.text('63, Indra St, Kanjikovil Road, Perundurai', 45, 22);
    doc.text('Tamil Nadu - 638052', 70, 28);
    doc.text('Phone: +91 98427 20663', 65, 34);
    doc.line(10, 38, 200, 38);

    // Receipt Info
    doc.setFont('courier', 'normal');
    doc.text(`Date: ${new Date(this.receiptData.createdAt).toLocaleDateString()}`, 10, 46);
    doc.text(`Receipt No: ${this.receiptData._id}`, 10, 52);
    doc.text(`Customer: ${this.receiptData.userName}`, 10, 58);
    doc.line(10, 62, 200, 62);

    // Table Header
    let yPosition = 70;
    doc.setFontSize(10);
    doc.text('S.No', 12, yPosition);
    doc.text('Item', 40, yPosition);
    doc.text('Qty', 120, yPosition);
    doc.text('Price', 140, yPosition);
    doc.text('Total', 170, yPosition);
    doc.line(10, yPosition + 2, 200, yPosition + 2);

    // Table Content
    yPosition += 8;
    this.receiptData.cartData.forEach((item, index) => {
      doc.text(`${index + 1}`, 12, yPosition);
      doc.text(`${item.productName}`, 40, yPosition);
      doc.text(`${item.productQuantity}`, 120, yPosition);
      doc.text(`Rs. ${item.productPrice.toFixed(2)}`, 140, yPosition);
      doc.text(`Rs. ${(item.productQuantity * item.productPrice).toFixed(2)}`, 170, yPosition);
      yPosition += 8;
    });

    doc.line(10, yPosition + 2, 200, yPosition + 2);
    yPosition += 10;

    // Totals
    doc.setFont('courier', 'bold');
    doc.text(`Subtotal: Rs. ${this.receiptData.subtotal.toFixed(2)}`, 130, yPosition);
    yPosition += 6;
    doc.text(`Shipping: Rs. ${this.receiptData.shipping.toFixed(2)}`, 130, yPosition);
    yPosition += 6;
    doc.text(`Discount: Rs. ${this.receiptData.discount.toFixed(2)}`, 130, yPosition);
    yPosition += 8;
    doc.text(`Total: Rs. ${this.receiptData.total.toFixed(2)}`, 130, yPosition);
    yPosition += 10;

    doc.line(10, yPosition, 200, yPosition);
    yPosition += 10;
    doc.text('Thank you for shopping with us!', 60, yPosition);

    // Save PDF
    doc.save(`Receipt_${this.receiptData._id}.pdf`);
    this.makeLoading = false;
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.moveTo('/home');
    }
  }

  shopNow(): void {
    this.router.moveTo('/products');
  }

  openModal(order: OrderDataSchema) {
    if (!order.cancellationMailSent) {
      this.selectedOrder = order;
      this.isModalOpen = true;
    } else {
      this.toast.info('Cancellation request is already sent. Please wait.');
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.cancelReason = '';
    this.selectedOrder = null;
  }

  confirmCancel() {
    if (this.cancelReason.trim() && this.selectedOrder) {

      const cancelData={
        orderId:this.selectedOrder._id,
        reason:this.cancelReason.trim(),
        email:this.storage.getData().email,
        fullName:this.selectedOrder.userName,
      }

      this.makeLoading=true;
      this.http.post('http://localhost:8080/order-api/send-cancellation-mail',cancelData).subscribe(
        {
          next:(res)=>{
            this.toast.info("Your cancellation request has been submitted. The status will be updated shortly.");
         this.closeModal();
         this.makeLoading=false;
          },
          error:(err)=>{
            this.toast.error('Error sending cancellation mail!');
         this.closeModal();
         this.makeLoading=false;
          }
        }
      );
    } else {
      this.toast.error('Please enter a reason for cancellation.');
    }
  }
}

interface OrderDataSchema {
  _id: string;
  status: string;
  paymentType: string;
  address: string;
  cartData: { productName: string; productPrice: number; productQuantity: number; productImg: string }[];
  userId: string;
  subtotal: number;
  total: number;
  shipping: number;
  discount: number;
  createdAt: string;
  expectedArrival: string;
  userName: string;
  cancellationMailSent: boolean;
}

interface ReceiptDataSchema {
  _id: string;
  userName: string;
  cartData: { productName: string; productPrice: number; productQuantity: number; productImg: string }[];
  userId: string;
  subtotal: number;
  total: number;
  shipping: number;
  discount: number;
  createdAt: string;
}
