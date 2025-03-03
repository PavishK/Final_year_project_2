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

    // Header: Store Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Sri Murugan Biscuit Bakery', 60, 15);
    doc.setFontSize(10);
    doc.text('63, Indra St, Kanjikovil road, Perundurai, Tamil Nadu 638052', 40, 22);
    doc.text('Phone: +91 98427 20663 | Email: smtbakery@gmail.com', 50, 28);

    doc.line(10, 32, 200, 32); // Separator Line

    // Title
    doc.setFontSize(12);
    doc.text('RECEIPT', 90, 40);

    // Customer & Order Info
    doc.setFont('helvetica', 'normal');
    doc.text(`Customer Name: ${this.receiptData.userName}`, 10, 50);
    doc.text(`Receipt No: ${this.receiptData._id}`, 10, 58);
    doc.text(`Date: ${new Date(this.receiptData.createdAt).toLocaleDateString()}`, 10, 66);

    doc.line(10, 70, 200, 70); // Separator Line

    // Table Header
    let yPosition = 78;
    doc.setFontSize(10);
    doc.text('S.No', 12, yPosition);
    doc.text('Item', 40, yPosition);
    doc.text('Qty', 120, yPosition);
    doc.text('Price', 140, yPosition);
    doc.text('Total', 170, yPosition);

    doc.line(10, yPosition + 2, 200, yPosition + 2); // Line below headers

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

    // Save Receipt PDF
    doc.save(`Receipt_${this.receiptData._id}.pdf`);
    this.makeLoading = false;
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.moveTo('/home'); // Redirect to home if no history available
    }
  }

  cancelOrder(id:string):void{
    console.log("Order Cancel!")
  }

  shopNow():void{
    this.router.moveTo('/products');
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
