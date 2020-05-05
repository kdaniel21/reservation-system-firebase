import { AngularFireFunctions } from '@angular/fire/functions';
import {
  ContactMetaData,
  ContactMessage,
} from './../admin/admin-dashboard/admin-contact/contact.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, take, switchMap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { User } from '../auth/user.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private store: Store<AppState>
  ) {}

  sendContactForm(contactForm: FormGroup, userId: string) {
    const controls = contactForm.controls;

    const id = this.afStore.createId();

    const createMetaData = this.afStore
      .collection<ContactMetaData>('contacts')
      .doc(id)
      .set({
        name: controls.name.value,
        email: controls.email.value,
        topic: controls.type.value,
        priority: controls.type.value === 'Option2',
        closed: false,
        date: new Date(),
        createdBy: userId,
      });

    const createFirstMessage = this.afStore
      .collection('contacts/' + id + '/messages')
      .add({
        message: controls.message.value,
        sentBy: { name: controls.name.value, admin: false },
        date: new Date(),
      });

    return Promise.all([createMetaData, createFirstMessage]);
  }

  getContactHistory(userId: string) {
    return this.afStore
      .collection<ContactMetaData>('contacts', (ref) =>
        ref.where('createdBy', '==', userId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            data.date = data.date.toDate();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getContact(id: string) {
    return this.afStore
      .collection<ContactMetaData>('contacts')
      .doc<ContactMetaData>(id)
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          const id = actions.payload.id;
          const data = actions.payload.data();
          data.date = data.date.toDate();

          return { id, ...data };
        })
      );
  }

  getMessages(id: string) {
    return this.afStore
      .collection<ContactMessage>('contacts/' + id + '/messages', (ref) =>
        ref.orderBy('date', 'desc')
      )
      .valueChanges()
      .pipe(
        map((messages) => {
          // Convert dates to JS Date object
          messages.forEach((m) => (m.date = m.date.toDate()));
          return messages;
        })
      );
  }

  sendReplyEmail(metaData: ContactMetaData, message: string) {
    const data = {
      email: metaData.email,
      name: metaData.name,
      topic: metaData.topic,
      message,
    };

    // Sends email
    return this.afFunctions.httpsCallable('sendEmail')(data).toPromise();
  }

  // Saves reply to Firestore
  saveReplyToFirestore(user: User, metaData: ContactMetaData, message: string) {
    return this.afStore
      .collection('contacts/' + metaData.id + '/messages')
      .add({
        date: new Date(),
        message,
        sentBy: {
          name: user.name,
          email: user.email,
          admin: user.admin,
        },
      });
  }

  sendReply(metaData: ContactMetaData, message: string) {
    return this.store
      .select('auth')
      .pipe(
        switchMap((authState) => {
          if (authState.user.admin) {
            // sends email only if admin sends the message
            return Promise.all([
              this.sendReplyEmail(metaData, message),
              this.saveReplyToFirestore(authState.user, metaData, message),
            ]);
          } else {
            return this.saveReplyToFirestore(authState.user, metaData, message);
          }
        })
      )
      .toPromise();
  }

  closeContact(id: string, closed: boolean) {
    return this.afStore.collection('contacts').doc(id).update({
      closed,
    });
  }
}
