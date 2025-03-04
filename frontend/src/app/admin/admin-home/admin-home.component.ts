import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  public countData: CountDataSchema = { userCount: 0, productCount: 0, orderCount: 0, total: 0 };
  stats = [
    { label: 'Users', count: 0, color: '#3B82F6' },  // Blue
    { label: 'Products', count: 0, color: '#10B981' }, // Green
    { label: 'Orders', count: 0, color: '#FACC15' },   // Yellow
    { label: 'Revenue', count: 0, color: '#EF4444' }   // Red
  ];

  makeLoading:boolean=false;

  pieChartData: any[] = [];
  barChartData: any[] = [];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []
  };

  constructor(private http: HttpClient, private toast: ToastrService) { }

  ngOnInit(): void {
    this.makeLoading=true;
    this.http.get('http://localhost:8080/admin-api/get-count').subscribe({
      next: (res: any) => {
        this.countData = res;
        this.stats = [
          { label: 'Users', count: this.countData.userCount, color: '#3B82F6' },  // Blue
          { label: 'Products', count: this.countData.productCount, color: '#10B981' }, // Green
          { label: 'Orders', count: this.countData.orderCount, color: '#FACC15' },   // Yellow
          { label: 'Revenue', count: this.countData.total, color: '#EF4444' }   // Red
        ];

        // Update chart data
        this.pieChartData = this.stats.map(item => ({
          name: item.label,
          value: Number(item.count<100?item.count*100:item.count)
        }));

        this.barChartData = this.stats.map(item => ({
          name: item.label,
          value: Number(item.count)
        }));

        // Update color scheme dynamically
        this.colorScheme = {
          name: 'custom',
          selectable: true,
          group: ScaleType.Ordinal,
          domain: this.stats.map(item => item.color)
        };
        this.makeLoading=false;
      },
      error: () => {
        this.toast.error("Unable to get Counts!");
        this.makeLoading=false;
      }
    });
  }
}

interface CountDataSchema {
  userCount: number;
  productCount: number;
  orderCount: number;
  total: number;
}
