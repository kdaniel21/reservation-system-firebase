import { Post } from './../../../blog/post.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminBlogService {
  constructor(private afStore: AngularFirestore) {}

  getPosts() {
    return this.afStore
      .collection<Post>('posts', (ref) => ref.orderBy('date', 'desc'))
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
}
