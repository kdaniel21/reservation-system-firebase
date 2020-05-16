import { ConfirmationModalComponent } from './../../shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from './../../reservation/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogService } from './../blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
})
export class BlogEditComponent implements OnInit {
  editForm: FormGroup = this.fb.group({
    title: this.fb.control(null),
    url: this.fb.control(null),
    date: this.fb.control(new Date()),
    time: this.fb.control(this.resService.stringifyTime(new Date())),
    imageUrl: this.fb.control(null),
    lead: this.fb.control(null),
    content: this.fb.control(null),
    public: this.fb.control(false),
  });

  id: string;
  cardTitle = 'Create Post';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private snackBar: MatSnackBar,
    private resService: ReservationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.loading = true;
      // load article
      this.blogService
        .loadPostToEdit(id)
        .pipe(take(1))
        .subscribe((post) => {
          this.loading = false;

          this.id = post.id;
          this.cardTitle = 'Edit Post - ' + post.title;

          this.editForm.setValue({
            title: post.title,
            url: post.url,
            date: post.date.toDate(),
            time: this.resService.stringifyTime(post.date.toDate()),
            imageUrl: post.imageUrl,
            lead: post.lead,
            content: post.content,
            public: post.public,
          });
        });
    }
  }

  createUrl() {
    const urlTouched = this.editForm.controls.url.touched;
    const title: string = this.editForm.value.title;
    if (!urlTouched && title != null) {
      this.editForm.patchValue({
        url: title.replace(' ', '-').toLowerCase(),
      });
    }
  }

  onSubmit() {
    const values = { ...this.editForm.value };

    // Combine date and time fields
    const time = values.time.split(':');
    values.date.setHours(time[0]);
    values.date.setMinutes(time[1]);
    delete values.time;

    if (this.id) {
      this.blogService
        .editPost(this.id, values)
        .then(() => {
          this.snackBar.open('The post was updated successfully!');
          this.router.navigate(['blog/latest']);
        })
        .catch((err) => {
          this.snackBar.open('Something went wrong. Try again!');
          console.log('ERROR: ', err);
        });
    } else {
      this.blogService
        .savePost(values)
        .pipe(take(1))
        .subscribe(
          () => {
            this.snackBar.open('The post was created!');
            this.router.navigate(['blog/latest']);
          },
          (err) => {
            this.snackBar.open('Something went wrong. Try again!');
            console.log('ERROR: ', err);
          }
        );
    }
  }

  onDeletePost() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to delete this post? If you just do not need it, you can set it to not be public.',
        submitBtnText: 'Delete',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === 'confirm') {
          // delete post
          this.loading = true;
          this.blogService
            .deletePost(this.id)
            .then(() => {
              this.snackBar.open('Post deleted successfully.');
              this.router.navigate(['blog/latest']);
            })
            .catch((err) =>
              this.snackBar.open('Post could not be deleted. Try again!')
            )
            .finally(() => (this.loading = false));
        }
      });
  }
}
