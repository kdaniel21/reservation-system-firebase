import { Subscription } from 'rxjs';
import { BlogService } from './../blog.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-blog-feed',
  templateUrl: './blog-feed.component.html',
  styleUrls: ['./blog-feed.component.css'],
})
export class BlogFeedComponent implements OnInit, OnDestroy {
  constructor(
    public blogService: BlogService,
    private store: Store<AppState>
  ) {}

  posts: Post[];
  loading = false;
  userAdmin: boolean;

  postsSub: Subscription;

  ngOnInit() {
    this.loading = true;

    this.store
      .select('auth')
      .pipe(take(1))
      .subscribe((authState) => {
        if (authState.user) {
          this.userAdmin = authState.user.admin;
        }
      });

    this.postsSub = this.blogService.loadPosts().subscribe((posts) => {
      console.log(posts);
      this.loading = false;

      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
