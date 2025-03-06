import { Component, Input } from '@angular/core';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css'],
})
export class SuccessPopupComponent {
  @Input() isVisible: boolean = false;

  constructor(private route:RouterManagerService){}

  hidePopup() {
    this.isVisible = false;
    setTimeout(()=>window.location.reload(),500);
  }

  viewOrder() {
    this.route.moveTo('/user/orders');
    this.hidePopup();

  }
}
