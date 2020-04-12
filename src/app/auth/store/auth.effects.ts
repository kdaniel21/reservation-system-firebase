import { Actions, Effect, ofType } from '@ngrx/effects/';
import { Injectable } from '@angular/core';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions
  ) {}

  @Effect()
  getUser = this.actions$.pipe(
    ofType(AuthActions.GET_USER),
    switchMap(() => this.afAuth.authState),
    switchMap((authData) => {
      if (authData) {
        return from(authData.getIdTokenResult()).pipe(
          map((idTokenResult) => {
            const user = new User(
              authData.uid,
              authData.email,
              authData.displayName,
              idTokenResult.claims.admin ? idTokenResult.claims.admin : false
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

  @Effect()
  login = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    map((action: AuthActions.Login) => action.payload),
    switchMap((loginData) => {
      return of(
        this.afAuth.signInWithEmailAndPassword(
          loginData.email,
          loginData.password
        )
      );
    }),
    map(() => new AuthActions.GetUser())
  );
}
