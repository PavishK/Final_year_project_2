import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

interface Coupon {
  _id: string;
  coupon_code: string;
  exp_date: string;
  discount: number;
  max_use: number;
}

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.css'],
})
export class ManageCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  currentCoupon: Coupon = this.getEmptyCoupon();
  editMode = false;
  selectedCouponIndex: number | null = null;
  loading = false;

  constructor(private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCoupons();
  }

  convertToDateString(dateString: string): string {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return ''; // Handle invalid dates

    return dateObj.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }

  fetchCoupons(): void {
    this.loading = true;
    this.http.get<Coupon[]>('http://localhost:8080/coupon-api/get-coupon-data').subscribe(
      (res) => {
        this.coupons = res.map(coupon => ({
          ...coupon,
          exp_date: this.convertToDateString(coupon.exp_date) // Convert date format
        }));
        this.loading = false;
      },
      (err) => {
        this.toastr.error('Unable to fetch coupons');
        this.loading = false;
      }
    );
  }

  submitCoupon(): void {
    this.currentCoupon.coupon_code = this.currentCoupon.coupon_code.toUpperCase();
    this.currentCoupon.exp_date=new Date(this.currentCoupon.exp_date).toDateString();

    if (!this.validateCoupon()) return;

    this.loading = true;
    if (this.editMode && this.selectedCouponIndex !== null) {
      this.updateCoupon();
    } else {
      this.addCoupon();
    }
  }

  addCoupon(): void {
    this.http.post<Coupon>('http://localhost:8080/coupon-api/insert-coupon-data', this.currentCoupon).subscribe(
      (res) => {
        this.coupons.push(res);
        this.toastr.success('Coupon added successfully!');
        this.resetForm();
      },
      (err) => {
        this.toastr.error('Unable to add coupon');
      }
    ).add(() => this.loading = false);
  }

  updateCoupon(): void {

    this.currentCoupon.coupon_code=this.currentCoupon.coupon_code.toUpperCase();
    this.currentCoupon.exp_date = this.convertToDateString(this.currentCoupon.exp_date);

    this.coupons[this.selectedCouponIndex!] = { ...this.currentCoupon };
    console.log(this.currentCoupon);

    this.http.put(`http://localhost:8080/coupon-api/update-coupon-data/${this.currentCoupon._id}`, this.currentCoupon)
      .subscribe({
        next: (res) => {
          this.toastr.success('Coupon updated successfully!');
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to update coupon.');
          this.loading = false;
        }
      });
}

  editCoupon(index: number): void {
    this.selectedCouponIndex = index;
    this.currentCoupon = { ...this.coupons[index] };
    this.editMode = true;
  }

  deleteCoupon(coupon_code: string): void {
    this.loading = true;
    this.http.delete(`http://localhost:8080/coupon-api/delete-coupon-data/${coupon_code}`).subscribe(
      () => {
        this.coupons = this.coupons.filter(coupon => coupon._id !== coupon_code);
        this.toastr.success('Coupon deleted successfully!');
      },
      () => {
        this.toastr.error('Unable to delete coupon');
      }
    ).add(() => this.loading = false);
  }

  resetForm(): void {
    this.currentCoupon = this.getEmptyCoupon();
    this.editMode = false;
    this.selectedCouponIndex = null;
  }

  validateCoupon(): boolean {

    if(!/^[A-Za-z]+$/.test(this.currentCoupon.coupon_code)){
      this.toastr.error('Coupon code should only contain alphabets.');
      return false;
    }

    if (!this.currentCoupon.coupon_code.trim() || this.currentCoupon.coupon_code.length !== 10) {
      this.toastr.error('Coupon code must be exactly 10 characters long.');
      return false;
    }

    if (!this.currentCoupon.exp_date.trim() || this.currentCoupon.discount <= 0) {
      this.toastr.error('Please fill all fields correctly.');
      return false;
    }
    return true;
  }

  getEmptyCoupon(): Coupon {
    return { _id: '', coupon_code: '', exp_date: '', discount: 0, max_use: 0 };
  }
}
