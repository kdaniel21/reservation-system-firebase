import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { BlogService } from './../blog.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css'],
})
export class BlogViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {}

  post: Post;
  loading = false;

  ngOnInit() {
    const url = this.route.snapshot.params['url'];
    if (url) {
      this.blogService
        .loadPostToRead(url)
        .pipe(take(1))
        .subscribe(
          (post) => {
            console.log(post);
            this.post = post;
          },
          (err) => {
            this.snackBar.open('Article is not existing. Try again!');
            console.log('ERROR: ', err);
          },
          () => (this.loading = false)
        );
    }
  }
}
