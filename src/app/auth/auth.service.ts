import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';

interface UserData {
  admin: boolean;
  deleted: boolean;
  disabled: boolean;
  email: string;
  name: string;
  registered: Date;
  registeredBy: string;
  reservations: Array<string>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  expirationTimer;

  constructor(
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private afAuth: AngularFireAuth
  ) {}

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
          invitationId: user.invitation.id,
          reservations: [],
        });
      })
      .then(() => {
        // Invalidate invitation
        return this.afStore
          .collection('invitations')
          .doc(user.invitation.id)
          .update({
            valid: false,
          });
      })
      .catch((err) => {
        console.log('ERROR', err);
        throw new Error(err);
      });
  }

  loginUser(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getUserInfo(userId: string) {
    return this.afStore
      .collection<UserData>('users')
      .doc(userId)
      .get()
      .pipe(map((userData) => userData.data()));
  }

  getDisplayName(userId: string) {
    return this.afStore
      .collection<UserData>('users')
      .doc(userId)
      .get()
      .pipe(map((userData) => userData.data().name));
  }
}
