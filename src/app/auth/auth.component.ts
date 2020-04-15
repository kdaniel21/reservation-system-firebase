import { Component} from '@angular/core';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

import * as AuthActions from './store/auth.actions';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent{
  constructor(private store: Store<AppState>, private fb: FormBuilder) {}

  loginForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required])
  });

  onSubmit() {
    this.store.dispatch(
      new AuthActions.Login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
    );
  }
}
