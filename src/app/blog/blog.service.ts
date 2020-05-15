import { Post } from './post.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private afStore: AngularFirestore) {}

  loadPostToEdit(id: string) {
    return this.afStore
      .collection('posts')
      .doc<Post>(id)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const data = doc.payload.data();
          const id = doc.payload.id;
          return { id, ...data };
        })
      );
  }

  savePost(values) {
    return this.afStore.collection('posts').add(values);
  }

  editPost(id: string, values) {
    return this.afStore.collection('posts').doc(id).update({
      values,
    });
  }

  loadPosts() {
    //const posts = this.afStore.collection('posts', (ref) => ref.where('public', '==', true).where(''))
  }
}
