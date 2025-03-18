import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {

  public httpUrl:string=environment.httpUrl;

  public products: any[] = [];
  formData: any = this.getEmptyProduct();
  isEditing = false;
  makeLoading: boolean = false;
  file!: File;
  updatedData:UpdateSchema={
    name: '',
      type: '',
      desc: '',
      price: 0,
      stock_quantity: 0,
      minquantity: 0,
      maxquantity: 0,
      pieces: 0,
      rating: 0,
      isVeg: true,
  }

  constructor(private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.makeLoading = true;
    this.http.get(environment.httpUrl+"product-api/list-products")
      .subscribe({
        next: (res: any) => {
          this.products = res.data;
          this.makeLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.makeLoading = false;
        }
      });
  }

  getEmptyProduct() {
    return {
      name: '',
      type: '',
      desc: '',
      price: null,
      stock_quantity: null,
      minquantity: 1,
      maxquantity: 5,
      pieces: null,
      rating: 0,
      isVeg: true
    };
  }

  addProduct() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('details', JSON.stringify(this.formData));

    this.http.post(environment.httpUrl+'product-api/add-product', formData).subscribe(
      (res: any) => {
        console.log('Response:', res);
        this.products.push({ ...this.formData });
        this.toastr.success('Product added successfully!', 'Success');
      },
      (err: any) => {
        console.error('Error:', err.error.message);
        this.toastr.error(err.error.message);
      }
    );
    this.formData = this.getEmptyProduct();
  }

  public ScrollIntoElement(): void {
    const ele = document.getElementById('goToProduct');
    if (ele)
      ele.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  editProduct(product: any) {
    this.ScrollIntoElement();
    this.formData = { ...product };
    this.isEditing = true;
  }

  updateProduct() {
    const index = this.products.findIndex(p => p._id === this.formData._id);
    if (index !== -1) {
      this.products[index] = { ...this.formData };
    }

     this.formData.src;
     this.updateProduct=this.formData;
    this.http.put(`${environment.httpUrl}product-api/update-product/${this.formData._id}`,this.updateProduct).
    subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.toastr.info('Product updated successfully!', 'Updated');
          this.formData = this.getEmptyProduct();
          this.isEditing = false;
        },
        error:(err)=>{
          console.log(err);
        }
      }
    )
  }

  deleteProduct(product: any) {
    this.products = this.products.filter(p => p !== product);
    this.makeLoading = true;
    this.http.delete(`${environment.httpUrl}product-api/delete-product/${product._id}`)
      .subscribe({
        next: (res: any) => {
          this.makeLoading = false;
          this.toastr.success(res.message);
        },
        error: (err: any) => {
          this.makeLoading = false;
          this.toastr.error(err.error.message);
        }
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.file = file;
    }
  }
}


interface UpdateSchema{

  name: string;
  type: string;
  desc: string;
  price: number;
  stock_quantity: number;
  minquantity: number;
  maxquantity: number;
  pieces: number;
  rating: number;
  isVeg: boolean;

}
