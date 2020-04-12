import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminUsersService } from '../admin-users.service';

@Component({
  selector: 'app-admin-user-invite',
  templateUrl: './admin-user-invite.component.html',
})
export class AdminUserInviteComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private usersService: AdminUsersService
  ) {}

  loading = false;
  alertMsg;
  inviteUserForm = this.fb.group({
    name: this.fb.control(null),
    email: this.fb.control(null, Validators.required),
  });

  onInviteUser() {
    this.loading = true;
    const email = this.inviteUserForm.controls.email.value;
    const name = this.inviteUserForm.controls.name.value;

    this.usersService.sendInvitation({ email, name}).subscribe((res) => {
      this.loading = false;
      this.alertMsg = {
        color: 'alert-success',
        message: res
      };
    }, err => {
      this.loading = false;
      this.alertMsg = {
        color: 'alert-danger',
        message: err
      };
    })
  }
}
