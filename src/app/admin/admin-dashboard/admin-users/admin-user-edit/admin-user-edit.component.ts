import { Component, OnInit, Inject } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdminUsersService } from '../admin-users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.css'],
})
export class AdminUserEditComponent implements OnInit {
  user: User;
  loading = false;

  constructor(
    public fb: FormBuilder,
    private userService: AdminUsersService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialogRef: MatDialogRef<AdminUserEditComponent>,
    private snackBar: MatSnackBar
  ) {}

  userEditForm: FormGroup;

  ngOnInit() {
    this.user = { ...this.data.user };

    this.userEditForm = this.fb.group({
      name: this.fb.control(this.user.name, Validators.required),
      email: this.fb.control(this.user.email, Validators.required),
      admin: this.fb.control(this.user.admin),
    });
  }

  onSaveEdit() {
    const controls = this.userEditForm.controls;
    this.loading = true;

    this.userService
      .editUser(this.user, controls)
      .then(() => {
        // Show success message
        this.snackBar.open(
          `The profile of ${this.user.name} has been updated successfully!`
        );
        this.dialogRef.close();
      })
      .catch((err) => {
        this.snackBar.open(
          `The profile of ${this.user.name} couldn't be updated. Please try again later! ${err}`,
          null,
          {
            duration: 4000,
          }
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
