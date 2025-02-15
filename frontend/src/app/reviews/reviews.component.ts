import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { StorageService } from '../storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  newReview = { name: '', userId: '', rating: 0, comment: '', date: '', image: '' };
  file: File | null = null;
  userID:string='';
  isImageTouched:boolean=false;
  imagePath:string="";
  makeLoading:boolean=false;

  constructor(private http: HttpClient, private storage: StorageService, private toast: ToastrService) {}

  ngOnInit(): void {
    const userData = this.storage.getData();
    if (userData) {
      this.newReview.name = userData.name || '';
      this.userID=userData.id || '';
      this.newReview.userId = userData.id || '';
    }
    this.makeLoading=true;
    this.http.get("http://localhost:8080/review-api/display-review-data")
      .subscribe({
        next: (res: any) => {
          this.reviews = res || [];
        },
        error: (err: any) => console.error('Error fetching reviews:', err.message)
      });
      this.makeLoading=false;
  }

  addReview(): void {
    if (this.newReview.rating > 0 && this.newReview.comment.trim()) {
      this.newReview.date = new Date().toISOString().split('T')[0];

      const formData = new FormData();
      if (this.file) {
        formData.append('file', this.file);
      }
      formData.append('details', JSON.stringify(this.newReview));
      console.log(formData.get('details'));
      this.makeLoading=true;
      this.http.post('http://localhost:8080/review-api/insert-review-data', formData)
        .subscribe({
          next: (res: any) => {
            const imageUrl = res.data?.imageUrl || '';
            this.reviews.unshift({ ...this.newReview, image: imageUrl });
            this.toast.success('Review added successfully');
            this.resetForm();
          },
          error: (err: any) => {
            console.error('Error:', err.error);
            this.toast.error('Failed to add review');
          }
        });
        this.makeLoading=false;
    } else {

      this.toast.warning('Please provide a rating and a comment');
    }
  }

  onFileChange(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newReview.image = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  resetForm(): void {
    this.newReview = { name: '', userId: '', rating: 0, comment: '', date: '', image: '' };
    this.file = null;
  }

  onImageClicked(src:string):void{
    this.isImageTouched=true;
   this.imagePath="http://localhost:8080"+src;
  }
}
