import { Post } from './post.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(
    private afStore: AngularFirestore,
    private store: Store<AppState>
  ) {}

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

  loadPostToRead(url: string) {
    return this.afStore
      .collection<Post>('posts', (ref) => ref.where('url', '==', url).limit(1))
      .get()
      .pipe(
        map((doc) => {
          const post = doc.docs[0].data() as Post;
          post.date = post.date.toDate();
          return post;
        })
      );
  }

  savePost(values) {
    // Add current user as author to the post & save into Firestore
    return this.store.select('auth').pipe(
      switchMap((authState) => {
        values.author = authState.user.name;
        return this.afStore.collection('posts').add(values);
      })
    );
  }

  editPost(id: string, values) {
    return this.afStore.collection('posts').doc(id).update(values);
  }

  loadPosts() {
    const posts = this.afStore.collection<Post>('posts', (ref) =>
      ref
        .where('public', '==', true)
        .where('date', '<=', new Date())
        .orderBy('date', 'desc')
    );

    return posts.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          data.date = data.date.toDate();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  deletePost(id: string) {
    return this.afStore.collection('posts').doc(id).delete();
  }
}
