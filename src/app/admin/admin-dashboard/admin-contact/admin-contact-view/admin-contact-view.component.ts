import { FormBuilder, Validators } from '@angular/forms';
import { UserMessage } from './../message.model';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-contact-view',
  templateUrl: './admin-contact-view.component.html',
  styleUrls: ['./admin-contact-view.component.css'],
})
export class AdminContactViewComponent implements OnInit {
  loading: boolean;
  message;
  replyForm = this.fb.group({
    answer: this.fb.control(null, Validators.required),
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.loading = true;
    this.route.data
      .pipe(
        take(1),
        map((data) => data.res)
      )
      .subscribe((message) => {
        this.loading = false;
        this.message = message;
        console.log('DATA:', message);
      });
  }

  onReply() {}
}
