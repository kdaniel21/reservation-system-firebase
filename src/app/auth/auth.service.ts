import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

import * as AuthActions from './store/auth.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  expirationTimer;

  constructor(
    private store: Store<AppState>,
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private afAuth: AngularFireAuth
  ) {}

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

  getInvitationData(id: string) {
    return this.afStore
      .collection('invitations')
      .doc(id)
      .get()
      .pipe(
        map((invitationData) => {
          // Check errors
          if (!invitationData.exists || !invitationData.data().valid) {
            throw new Error(
              'This invitation is not valid! Please try again with a new invitation link.'
            );
          } else if (
            new Date().getTime() >
            invitationData.data().expirationDate.toDate().getTime()
          ) {
            throw new Error(
              'This invitation has expired! It is no longer available.'
            );
          }

          return invitationData.data();
        })
      );
  }

  registerUser(userData: { name: string; password: string; invitation: any }) {
    const user = { ...userData };

    // Create user in the auth
    return this.afFunctions
      .httpsCallable('createUser')({
        email: user.invitation.email,
        password: user.password,
      })
      .toPromise()
      .then((userRecord) => {
        // Create user record in Firestore
        return this.afStore.collection('users').doc(userRecord.user.uid).set({
          admin: false,
          disabled: false,
          deleted: false,
          email: userRecord.user.email,
          name: user.name,
          registered: new Date(),
          registeredBy: user.invitation.invitedBy,
          reservations: [],
        });
      })
      .then((newRes) => {
        // Invalidate invitation
        return this.afStore
          .collection('invitations')
          .doc(user.invitation.id)
          .update({
            valid: false,
          });
      })
      // .then((finalRes) => {
      //   return 'User registered successfully!';
      // })
      .catch((err) => {
        console.log('ERROR', err);
        return err;
      });
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}
