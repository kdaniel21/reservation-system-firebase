import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {
  //@Input() color: string;
  @Input() title: string;
  @Input() message: string;
  @Input() submitBtnText: string;

  constructor(public activeModal: NgbActiveModal) {}
}
