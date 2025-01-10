import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ProductCountService } from '../product-count.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class ProductsComponent implements OnInit {

  public makeLoading: boolean = false;
  public products: any[] = [];
  public showProducts:any[]=[];
  public items: items[] = [
    { id: 1, src: "icons/dish.svg", name: "all menu", items: 0 },
    { id: 2, src: "icons/bread.svg", name: "bread", items: 0 },
    { id: 3, src: "icons/cake.svg", name: "cake", items: 0 },
    { id: 4, src: "icons/rusk.svg", name: "rusk", items: 0 },
    { id: 5, src: "icons/biscuit.svg", name: "biscuit", items: 0 },
  ];
  public searchProduct: SearchProducts = new SearchProducts();

  public ScrollIntoElement(): void {
    const ele = document.getElementById('productList');
    if (ele)
      ele.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private ActivateLoader(): void {
    this.makeLoading = true;
    setTimeout(() => this.makeLoading = false, 1000);
  }

  constructor(private http: HttpClient, private toast:ToastrService, private countItems:ProductCountService) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8080/product-api/list-products")
      .subscribe({
        next: (res: any) => {
          this.products = res.data;
          this.showProducts=res.data;
          this.items=this.countItems.getIntemsCount(this.products)[0];

        },
        error: (err) => this.toast.error(err.error.message)
      });

  }



  public matchColor: any = { bread: 'red', cake: 'gray', biscuit: 'orange', rusk: 'green' }

  public selectedItem: number = 1;
  public itemClicked(item: items): void {
    this.selectedItem = item.id;
    this.showProducts = this.FilterProducts(item.name);
  }

  public FilterProducts(type: string) {
    this.ActivateLoader();
    this.ScrollIntoElement();
    if (type == "all menu")
      return this.products;
    else
    return this.products.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

}

interface items {
  id: number;
  src: string;
  name: string;
  items: number;
}

class SearchProducts {

  public productName: string = "";

  public handleSearchBtn(): void {
    console.log(this.productName);
  }

}
