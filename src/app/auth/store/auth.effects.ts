import { Actions, Effect, ofType } from '@ngrx/effects/';
import { Injectable } from '@angular/core';
import {
  map,
  switchMap,
  catchError,
  take,
} from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  @Effect()
  getUser = this.actions$.pipe(
    ofType(AuthActions.GET_USER),
    switchMap(() => this.afAuth.authState),
    switchMap((authData) => {
      if (authData) {
        return this.authService.getUserInfo(authData.uid).pipe(
          take(1),
          map((userData) => {
            const user = new User(
              authData.uid,
              authData.email,
              userData.name,
              userData.admin
            );
            return new AuthActions.Authenticated(user);
          })
        );
      } else {
        return of(new AuthActions.NotAuthenticated());
      }
    }),
    catchError((err) => {
      throw new Error(err);
    })
  );

  @Effect()
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    switchMap(() => {
      return of(this.afAuth.signOut());
    }),
    map(() => {
      return new AuthActions.NotAuthenticated();
    })
  );
}
