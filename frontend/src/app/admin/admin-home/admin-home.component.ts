import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  stats = [
    { label: 'Users', count: 1200, color: '#3B82F6' },  // Blue
    { label: 'Products', count: 350, color: '#10B981' }, // Green
    { label: 'Orders', count: 870, color: '#FACC15' },   // Yellow
    { label: 'Revenue', count: 45000, color: '#EF4444' } // Changed '$45K' to 45000
  ];

  pieChartData = this.stats.map(item => ({
    name: item.label,
    value: Number(item.count) // Ensure all values are numbers
  }));

  barChartData = this.stats.map(item => ({
    name: item.label,
    value: Number(item.count) // Ensure all values are numbers
  }));

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.stats.map(item => item.color)
  };
}
