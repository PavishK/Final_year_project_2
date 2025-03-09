import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {

  orders: Order[] = [];
  editForm: FormGroup;
  selectedOrder: Order | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private toast: ToastrService) {
    this.editForm = this.fb.group({
      expectedArrival: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.http.get<Order[]>("http://localhost:8080/order-api/order-data").subscribe({
      next: (res) => {
        this.orders = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching orders:", err);
        this.toast.error("Failed to fetch orders", "Error");
        this.isLoading = false;
      }
    });
  }

  openEditModal(order: Order) {
    this.selectedOrder = { ...order };
    this.editForm.setValue({
      expectedArrival: order.expectedArrival || '',
      status: order.status || ''
    });
  }

  UpdateOrderData(id: string, body: any) {
    this.isLoading = true;
    return this.http.put(`http://localhost:8080/order-api/update-order/${id}`, body);
  }

  saveChanges() {
    if (this.selectedOrder) {
      this.isSaving = true;
      const updatedOrder = {
        ...this.selectedOrder,
        expectedArrival: this.editForm.value.expectedArrival,
        status: this.editForm.value.status,
        cancelled: this.editForm.value.status === "Cancelled"
      };

      const { _id, status, expectedArrival } = updatedOrder;

      this.UpdateOrderData(_id, { status, expectedArrival }).subscribe({
        next: () => {
          const index = this.orders.findIndex(o => o._id === _id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }
          this.selectedOrder = null;
          this.isSaving = false;
          //console.log("Edited Order Data:", updatedOrder);
          this.toast.success("Order updated successfully!", "Success");
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error updating order:", err);
          this.toast.error("Failed to update order", "Error");
          this.isSaving = false;
          this.isLoading=false;
        }
      });
    }
  }
}

interface Order {
  _id: string;
  userName: string;
  address: string;
  expectedArrival: string;
  status: string;
  total: number;
  cancelled: boolean;
  paymentType: string;
  cancellationMailSent:boolean;
  upiId:string;
}
