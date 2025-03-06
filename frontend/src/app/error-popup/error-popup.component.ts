import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css'],
})
export class ErrorPopupComponent {
  @Input() isVisible: boolean = false;

  hidePopup() {
    this.isVisible = false;
    setTimeout(()=>window.location.reload(),500);
  }

}
