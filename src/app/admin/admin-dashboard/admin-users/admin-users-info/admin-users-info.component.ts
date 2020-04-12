import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-admin-users-info',
  templateUrl: './admin-users-info.component.html'
})
export class AdminUsersInfoComponent {
  @Input() user: User;

  constructor(public activeModal: NgbActiveModal) {}
}
