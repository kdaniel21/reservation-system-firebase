import { Component, ViewChild } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

import * as AuthActions from './store/auth.actions';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @ViewChild('loginForm') loginForm;

  constructor(private store: Store<AppState>, private http: HttpClient) {}

  onSubmit() {
    this.store.dispatch(
      new AuthActions.LoginStart({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
    );
  }
}
