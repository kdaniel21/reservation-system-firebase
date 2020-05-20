import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ContactService } from '../contact.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { State } from 'src/app/auth/store/auth.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactHistoryComponent } from '../contact-history/contact-history.component';

@Component({
  selector: 'app-contact-user',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {}

  loading: boolean;
  userId: string = null;

  contactTypes = ['Option1', 'Option2', 'Option3', 'Option4'];
  contactForm: FormGroup = this.fb.group({
    name: this.fb.control(null, Validators.required),
    email: this.fb.control(null, [Validators.required, Validators.email]),
    type: this.fb.control(null, Validators.required),
    message: this.fb.control(null, Validators.required),
  });

  ngOnInit() {
    this.loading = true;

    this.store.select('auth').subscribe((authState: State) => {
      this.loading = false;
      // Set default values if user was logged in
      if (authState.user) {
        this.userId = authState.user.uid;

        // Prefill form
        this.contactForm.patchValue({
          name: authState.user.name,
          email: authState.user.email,
        });
        // Disable fields
        this.contactForm.controls['name'].disable();
        this.contactForm.controls['email'].disable();
      }
    });
  }

  onSubmit() {
    this.loading = true;

    this.contactService
      .sendContactForm(this.contactForm, this.userId)
      .then(() =>
        this.snackBar.open(
          'Your message was sent successfully! We will contact you soon through email!',
          'OKAY',
          {
            duration: 5000,
          }
        )
      )
      .catch((err) => {
        this.snackBar.open('Something went wrong! Please try again!', 'OKAY', {
          duration: 7000,
        });
        console.log(err);
      })
      .finally(() => (this.loading = false));
  }

  onShowContactHistory() {
    this.bottomSheet.open(ContactHistoryComponent, {
      data: { id: this.userId },
    });
  }
}
