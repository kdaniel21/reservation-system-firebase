import { Component } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

import * as AuthActions from './store/auth.actions';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  loading;

  loginForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });

  onSubmit() {
    this.loading = true;

    this.authService
      .loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.store.dispatch(new AuthActions.GetUser());

        // Show success message
        this.snackBar.open('Successfully logged in!', null, {
          duration: 3000
        });

        // Redirect in 2 seconds
        this.router.navigate(['/calendar/view']);
      })
      .catch(() => {
        // Show error message
        this.snackBar.open("Your email address and password doesn't match! Please try again", null, {
          duration: 3000
        })
      })
      .finally(() => (this.loading = false));
  }
}
