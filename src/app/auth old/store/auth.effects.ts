import { Actions, Effect, ofType } from '@ngrx/effects/';
import { Injectable } from '@angular/core';
import { tap, map, switchMap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

function handleLogin(
  email: string,
  localId: string,
  token: string,
  expiresIn: string
) {
  // calculate token expiration time
  const tokenExp = new Date().getTime() + +expiresIn * 1000;

  // create user object
  const user = new User(email, localId, token, tokenExp);

  // save to local storage
  localStorage.setItem('user', JSON.stringify(user));

  // dispatch new action
  return new AuthActions.Login({
    email,
    localId,
    token,
    tokenExpirationTime: tokenExp
  });
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  @Effect()
  startLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    // switchMap((authAction: AuthActions.LoginStart) => {
    //   // send login request to the Firebase Auth API
    //   return this.http
    //     .post<AuthResponse>(
    //       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
    //       {
    //         email: authAction.payload.email,
    //         password: authAction.payload.password,
    //         returnSecureToken: true
    //       },
    //       {
    //         params: new HttpParams().set('key', environment.firebase_key)
    //       }
    //     )
    //     .pipe(
    //       map(authRes => {
    //         // start auto-logout timer
    //         this.authService.startExpirationTimer(+authRes.expiresIn);
    //         // do login-related stuff + return a new action ( as observable )
    //         return handleLogin(
    //           authRes.email,
    //           authRes.localId,
    //           authRes.idToken,
    //           authRes.expiresIn
    //         );
    //       })
    //     );
    // })
  );

  // on logout
  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      console.log('LOGGED OUT!');
      // redirect user
      this.router.navigate(['/auth']);

      // delete user credentials from local storage
      localStorage.removeItem('user');

      // show alert message
    })
  );

  // redirect on login
  @Effect({ dispatch: false })
  loginRedirect = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      // successful login message

      // redirect after login
      //this.router.navigate(['/calendar/view']);
    })
  );

  // auto-login: runs at every page-load
  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      // Get data from local storage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        return { type: 'INVALID AUTOLOGIN' };
      }

      const user = new User(userData.email, userData.id, userData._token, userData._tokenExpTime);

      if (user.token) {
        return new AuthActions.Login({
          email: user.email,
          localId: user.id,
          token: user._token,
          tokenExpirationTime: user._tokenExpTime
        });
      } else {
        // if token is expired, delete from local storage
        localStorage.removeItem('user');
      }
      return { type: 'INVALID AUTOLOGIN' };
    })
  );
}
