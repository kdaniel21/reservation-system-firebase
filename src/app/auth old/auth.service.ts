import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";

import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: "root" })
export class AuthService {
  expirationTimer;

  constructor(private store: Store<AppState>) {}

  startExpirationTimer(expirationSeconds: number) {
    this.expirationTimer = setTimeout(() => {
      // log out user
      this.store.dispatch(new AuthActions.Logout());
      console.log('Logging out...');

      // destroy the timer
      this.deleteExpirationTimer();
    }, expirationSeconds * 1000);
  }

  deleteExpirationTimer() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }
}
