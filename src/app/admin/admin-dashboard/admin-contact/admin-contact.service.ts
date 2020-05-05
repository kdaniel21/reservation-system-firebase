import { Store } from '@ngrx/store';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ContactMetaData } from './contact.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, take, switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AdminContactService {
  constructor(private afStore: AngularFirestore) {}

  getContacts() {
    return this.afStore
      .collection<ContactMetaData>('contacts')
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
}
