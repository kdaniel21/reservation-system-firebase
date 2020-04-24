import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminUsersService } from '../admin-users.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-user-invite',
  templateUrl: './admin-user-invite.component.html',
  styleUrls: ['./admin-user-invite.component.css'],
})
export class AdminUserInviteComponent {
  constructor(
    public dialogRef: MatDialogRef<AdminUserInviteComponent>,
    private fb: FormBuilder,
    private usersService: AdminUsersService,
    private snackBar: MatSnackBar
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

    this.usersService
      .sendInvitation({ email, name })
      .pipe(tap(() => this.dialogRef.close()))
      .subscribe(
        (res) => {
          this.loading = false;
          this.dialogRef.close();
          this.snackBar.open(res);
        },
        (err) => {
          this.loading = false;
          this.snackBar.open(err);
        }
      );
  }
}
