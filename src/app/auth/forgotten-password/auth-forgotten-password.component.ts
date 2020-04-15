import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-forgotten-password',
  templateUrl: './auth-forgotten-password.component.html',
  styleUrls: ['./auth-forgotten-password.component.css'],
})
export class AuthForgottenPasswordComponent {
  loading;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  resetPasswordForm = this.fb.group({
    email: this.fb.control(null, [Validators.required, Validators.email]),
  });

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 5000 });
  }

  onSendResetPassword() {
    this.loading = true;

    const email = this.resetPasswordForm.controls.email.value;
    this.authService
      .sendPasswordResetEmail(email)
      .then(() => {
        this.openSnackBar(`Password reset email successfully sent to ${email}!`, null);
      })
      .catch(() => {
        this.openSnackBar("Password reset email couldn't be sent. Please try again!", null);
      })
      .finally(() => {
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['../auth/login']);
        }, 3000);
      });
  }
}
