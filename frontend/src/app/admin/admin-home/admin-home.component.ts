import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  stats = [
    { label: 'Users', count: 1200, color: 'bg-blue-500' },
    { label: 'Products', count: 350, color: 'bg-green-500' },
    { label: 'Orders', count: 870, color: 'bg-yellow-500' },
    { label: 'Revenue', count: '$45K', color: 'bg-red-500' }
  ];

}
