import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-forgotten-password',
  templateUrl: './auth-forgotten-password.component.html',
})
export class AuthForgottenPasswordComponent {
  loading;
  alertMsg;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  resetPasswordForm = this.fb.group({
    email: this.fb.control(null, [Validators.required, Validators.email]),
  });

  onSendResetPassword() {
    this.loading = true;

    const email = this.resetPasswordForm.controls.email.value;
    this.authService
      .sendPasswordResetEmail(email)
      .then(() => {
        this.alertMsg = {
          color: 'alert-success',
          message: `Password reset email successfully sent to ${email}`,
        };
      })
      .catch((err) => {
        this.alertMsg = {
          color: 'alert-danger',
          message: `Password reset email couldn't be sent.`,
        };
      })
      .finally(() => {
        this.loading = false;

        setTimeout(() => {
          this.alertMsg = null;
          this.router.navigate(['../auth/login']);
        }, 8000);
      });
  }
}
