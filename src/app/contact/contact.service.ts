import { AngularFireFunctions } from '@angular/fire/functions';
import { ContactMetaData } from './../admin/admin-dashboard/admin-contact/contact.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, take, switchMap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

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
      .collection('contacts')
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

          return { id, ...data };
        })
      );
  }

  getMessages(id: string) {
    return this.afStore
      .collection<ContactMetaData>('contacts/' + id + '/messages')
      .valueChanges();
  }

  sendReply(metaData: ContactMetaData, message: string) {
    const data = {
      email: metaData.email,
      name: metaData.name,
      topic: metaData.topic,
      message,
    };

    // Sends email
    const sendEmail = this.afFunctions
      .httpsCallable('sendEmail')(data)
      .toPromise();

    // Saves reply to Firestore
    const saveReplyToDB = this.store
      .select('auth')
      .pipe(
        take(1),
        switchMap((authState) => {
          // Gets user data from store
          const user = {
            name: authState.user.name,
            email: authState.user.email,
            admin: authState.user.admin,
          };

          // Saves to Firebase
          return this.afStore
            .collection('contacts/' + metaData.id + '/messages')
            .add({
              date: new Date(),
              message,
              sentBy: { ...user },
            });
        })
      )
      .toPromise();

    return Promise.all([sendEmail, saveReplyToDB]);
  }

  closeContact(id: string, closed: boolean) {
    console.log(id, closed);
    return this.afStore.collection('messages').doc(id).update({
      closed,
    });
  }
}
