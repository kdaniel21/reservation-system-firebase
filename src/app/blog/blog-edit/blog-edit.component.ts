import { ReservationService } from './../../reservation/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogService } from './../blog.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';

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
  title = 'Create Post';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private snackBar: MatSnackBar,
    private _location: Location,
    private resService: ReservationService
  ) {}

  ngOnInit() {
    const id = this.route.queryParams['id'];
    if (id) {
      // load article
      this.blogService
        .loadPostToEdit(id)
        .pipe(take(1))
        .subscribe((post) => {
          this.editForm.setValue({
            post,
          });

          this.id = post.id;
          this.title = 'Edit Post - ' + post.title;
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
    const values = {...this.editForm.value};

    // Create date field
    const time = values.time.split(':');
    values.date.setHours(time[0]);
    values.date.setMinutes(time[1]);
    delete values.time;

    console.log(values);

    // if (this.id) {
    //   this.blogService
    //     .editPost(this.id, values)
    //     .then(() => {
    //       this.snackBar.open('The post was updated successfully!');
    //       // TODO: navigate somewhere
    //       //this._location.back();
    //     })
    //     .catch((err) => {
    //       this.snackBar.open('Something went wrong. Try again!');
    //       console.log('ERROR: ', err);
    //     });
    // } else {
    //   this.blogService
    //     .savePost(values)
    //     .then(() => {
    //       this.snackBar.open('The post was created!');
    //       // TODO: navigate somewhere
    //       //this._location.back();
    //     })
    //     .catch((err) => {
    //       this.snackBar.open('Something went wrong. Try again!');
    //       console.log('ERROR: ', err);
    //     });
    // }
  }
}
