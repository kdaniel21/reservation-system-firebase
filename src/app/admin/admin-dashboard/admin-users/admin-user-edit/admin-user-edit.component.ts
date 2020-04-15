import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdminUsersService } from '../admin-users.service';

@Component({
  selector: 'app-admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
})
export class AdminUserEditComponent implements OnInit {
  @Input() user: User;
  alertMsg;
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    private userService: AdminUsersService
  ) {}

  userEditForm: FormGroup;

  ngOnInit() {
    this.userEditForm = this.fb.group({
      name: this.fb.control(this.user.name, Validators.required),
      email: this.fb.control(this.user.email, Validators.required),
      admin: this.fb.control(this.user.admin),
    });
  }

  onSaveEdit() {
    const controls = this.userEditForm.controls;
    this.loading = true;

    this.userService.editUser(this.user, controls).then(() => {
      // Show success message
      this.alertMsg = {
        color: 'alert-success',
        message: `The profile of ${this.user.name} has been updated successfully!`
      };
    })
    .catch((err) => {
      this.alertMsg = {
        color: 'alert-danger',
        message: `The profile of ${this.user.name} couldn't be updated! Error: ${err}`
      };
    })
    .finally(() => {
      this.loading = false;
      setTimeout(() => this.alertMsg = null, 4000);
    })

    // If everything is successful -> create success message

  }
}
