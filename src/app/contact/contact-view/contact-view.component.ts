import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-admin-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.css'],
})
export class ContactViewComponent implements OnInit {
  loading: boolean;
  contact;

  messagesSub: Subscription;

  replyForm = this.fb.group({
    answer: this.fb.control(null, Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    // Load metadata from resolver
    this.route.data
      .pipe(
        take(1),
        map((data) => data.res)
      )
      .subscribe((contact) => {
        this.loading = false;
        this.contact = contact;

        console.log(this.contact);

        if (this.contact.closed) {
          this.replyForm.disable();
        }
      });

    // Load messages
    if (this.contact.id) {
      this.loading = true;

      this.messagesSub = this.contactService
        .getMessages(this.contact.id)
        .subscribe((messages) => {
          this.loading = false;
          this.contact.messages = messages;
        });
    }
  }

  onReply() {
    this.loading = true;

    const message = this.replyForm.value.answer;

    this.contactService
      .sendReply(this.contact, message)
      .then(([sendEmailRes, saveDBRes]) => {
        this.snackBar.open(sendEmailRes.message);
        this.replyForm.reset();
      })
      .catch((error) => {
        this.snackBar.open('Something went wrong. Please try again!');
        console.log('ERROR:', error)
      })
      .finally(() => (this.loading = false));
  }

  onMarkAsSolved() {
    this.loading = true;

    const id = this.contact.id;
    const closed = !this.contact.closed;
    console.log(this.contact);

    this.contactService
      .closeContact(id, closed)
      .then(() => {
        this.replyForm.disable();
        this.snackBar.open('Message closed successfully!');
      })
      .catch((err) =>
        this.snackBar.open("Message couldn't have been closed. Try again!", err)
      )
      .finally(() => (this.loading = false));
  }
}
