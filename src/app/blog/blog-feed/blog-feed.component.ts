import { BlogService } from './../blog.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-blog-feed',
  templateUrl: './blog-feed.component.html',
  styleUrls: ['./blog-feed.component.css'],
})
export class BlogFeedComponent implements OnInit {
  constructor(
    public blogService: BlogService,
    private store: Store<AppState>
  ) {}

  posts: Post[];
  loading = false;
  userAdmin: boolean;

  ngOnInit() {
    this.loading = true;

    this.store.select('auth').subscribe((authState) => {
      if (authState.user) {
        this.userAdmin = authState.user.admin;
      }
    });

    this.blogService.loadPosts().subscribe((posts) => {
      console.log(posts);
      this.loading = false;

      this.posts = posts;
    });
  }
}
