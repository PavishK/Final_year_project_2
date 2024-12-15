import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private toastr: ToastrService) {}  // Inject ToastrService

  showSuccess() {
    this.toastr.success('Operation Successful!');
  }

  showError() {
    this.toastr.error('Something went wrong!', 'Error');
  }

  showInfo() {
    this.toastr.info('This is an info message.', 'Info');
  }

  showWarning() {
    this.toastr.warning('This is a warning message.', 'Warning');
  }
}
