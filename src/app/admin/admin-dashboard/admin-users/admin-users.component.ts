import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserInviteComponent } from './admin-user-invite/admin-user-invite.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent {
  constructor(private afFunctions: AngularFireFunctions, private modalService: NgbModal) {}

  onInviteUser() {
    const modalRef = this.modalService.open(AdminUserInviteComponent);
  }
}
