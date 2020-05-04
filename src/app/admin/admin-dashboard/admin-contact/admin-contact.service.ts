import { UserMessage } from './message.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminContactService {
  constructor(private afStore: AngularFirestore) {}

  getMessages() {
    return this.afStore
      .collection<UserMessage>('messages')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getMessage(id: string) {
    return this.afStore
      .collection<UserMessage>('messages')
      .doc(id)
      .get()
      .pipe(map((res) => res.data()));
  }
}
