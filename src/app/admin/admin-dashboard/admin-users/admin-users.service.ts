import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { from, of } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/app/auth/user.model';
import { StoredUser } from './admin-users-list/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private store: Store<AppState>
  ) {}

  // Get users that are not deleted
  getUsers() {
    return this.afStore
      .collection<StoredUser>('users', (ref) =>
        ref.where('deleted', '==', false)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const uid = a.payload.doc.id;
            return { uid, ...data };
          });
        })
      );
  }
  // Disable/Enable user globally
  disableUser(user) {
    const disableUserAuth = this.afFunctions
      .httpsCallable('updateUser')({
        uid: user.uid,
        updateObj: { disabled: !user.disabled },
      })
      .toPromise();

    const disableUserFirestore = this.afStore
      .collection('users')
      .doc(user.uid)
      .update({
        disabled: !user.disabled,
      });

    return Promise.all([disableUserAuth, disableUserFirestore]);
  }

  // Deletes user from Auth but stays (hidden) in Firestore
  deleteUser(user) {
    // Hide user in Firestore
    const deleteUserFirestore = this.afStore
      .collection('users')
      .doc(user.uid)
      .update({
        deleted: true,
      });

    // Delete user in Auth
    const deleteUserAuth = this.afFunctions
      .httpsCallable('deleteUser')({
        uid: user.uid,
      })
      .toPromise();

    return Promise.all([deleteUserFirestore, deleteUserAuth]);
  }

  editUser(user: User, controls) {
    const promises = [];

    const editUserFirestore = this.afStore
      .collection('users')
      .doc(user.uid)
      .update({
        name: controls.name.value,
        admin: controls.admin.value,
        email: controls.email.value,
      });
    promises.push(editUserFirestore);

    if (controls.admin.touched) {
      const manageAdminAccess = this.afFunctions
        .httpsCallable('manageAdminAccess')({
          email: controls.email.value,
          admin: controls.admin.value,
        })
        .toPromise();
      promises.push(manageAdminAccess);
    }

    if (controls.email.touched) {
      const updateUser = this.afFunctions
        .httpsCallable('updateUser')({
          uid: user.uid,
          updateObj: { email: controls.email.value },
        })
        .toPromise();

      promises.push(updateUser);
    }

    return Promise.all(promises);
  }

  sendInvitation(user: { email: string; name: string }) {
    // Create invitation
    return this.store.select('auth').pipe(
      // Get admin's UID from Store
      switchMap((authState) => {
        // Create invitation in Firestore
        return from(
          this.afStore.collection('invitations').add({
            email: user.email,
            name: user.name,
            invitedAt: new Date(),
            invitedBy: authState.user.uid,
            expirationDate: new Date(
              new Date().getTime() + 1000 * 60 * 60 * 24 * 5
            ), // 5 days from the date of invitation in ms
            valid: true,
          })
        );
      }),
      switchMap((docRef) => {
        // Send invitation email
        const sendInvitationEmail = this.afFunctions.httpsCallable(
          'sendInvitationEmail'
        );
        return from(
          sendInvitationEmail({
            email: user.email,
            name: user.name,
            id: docRef.id,
          }).toPromise()
        );
      }),
      map((res) => {
        if (res.error) {
          throw new Error(res.error);
        }

        return res.message;
      })
    );
  }
}
