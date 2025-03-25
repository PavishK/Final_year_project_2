import { environment } from './../../environments/environment';
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

  public httpUrl:string=environment.httpUrl;

  reviews: any[] = [];
  newReview = { name: '', userId: '', rating: 0, comment: '', date: '', image: '' };
  file: File | null = null;
  userID:string='';
  isImageTouched:boolean=false;
  imagePath:string="";
  makeLoading:boolean=false;
  public popupNotOrder:boolean=false;

  constructor(private http: HttpClient, private storage: StorageService, private toast: ToastrService) {}

  ngOnInit(): void {
    const userData = this.storage.getData();
    if (userData) {
      this.newReview.name = userData.name || '';
      this.userID=userData.id || '';
      this.newReview.userId = userData.id || '';
    }
    this.makeLoading=true;
    this.http.get(environment.httpUrl+"review-api/display-review-data")
      .subscribe({
        next: (res: any) => {
          this.reviews = res || [];
        },
        error: (err: any) => console.error('Error fetching reviews:', err.message)
      });
      this.makeLoading=false;
  }

  reviewController():boolean{
    var flag:boolean=false;
    this.makeLoading=true;
    this.http.get(`${environment.httpUrl}review-api/review-controller/${this.userID}`).
    subscribe(
      {
        next:(res)=>{
          this.popupNotOrder=false;
          flag=true;
          this.toast.success("Ordered Product Delivered!");
          this.makeLoading=false;
        },
        error:(err:any)=>{
          this.popupNotOrder=true;
          this.toast.info(err.error.message);
          flag=false;
          this.makeLoading=false;
        }
      }
    )
    return flag;
  }

  addReview(): void {



    if (this.newReview.rating > 0 && this.newReview.comment.trim()) {

      if(!this.reviewController()){
        // this.toast.info("Please Order To Post your Review!");
        return;
      }

      this.newReview.date = new Date().toISOString().split('T')[0];

      const formData = new FormData();
      if (this.file) {
        formData.append('file', this.file);
      }
      formData.append('details', JSON.stringify(this.newReview));
      console.log(formData.get('details'));
      this.makeLoading=true;
      this.http.post(environment.httpUrl+'review-api/insert-review-data', formData)
        .subscribe({
          next: (res: any) => {
            const imageUrl = res.data?.imageUrl || '';
            this.reviews.unshift({ ...this.newReview, image: imageUrl });
            this.toast.success('Review added successfully');
            this.resetForm();
          },
          error: (err: any) => {
            if(err.status==401)
              this.toast.error(err.error.message);

            else
              this.toast.error('Failed to add review');
            this.makeLoading=false;
          }
        });
        this.makeLoading=false;
    } else {

      this.toast.warning('Please provide a rating and a comment');
      this.makeLoading=false;
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
   this.imagePath=environment.httpUrl+src;
  }
}
