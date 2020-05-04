import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { InfoModalComponent } from 'src/app/shared/info-modal/info-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-register-user',
  templateUrl: './auth-register-user.component.html',
  styleUrls: ['./auth-register-user.component.css'],
})
export class AuthRegisterUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  loading: boolean;
  error: boolean;
  invitation;
  registerForm: FormGroup;

  ngOnInit() {
    const invitationId = this.route.snapshot.queryParams['id'];

    // Check key validity and get data
    if (invitationId) {
      this.loading = true;

      this.authService.getInvitationData(invitationId).subscribe(
        (invitation) => {
          this.loading = false;
          this.invitation = invitation;
          this.invitation.id = invitationId;

          // Set the form
          this.registerForm = this.fb.group({
            email: this.fb.control({ value: invitation.email, disabled: true }),
            name: this.fb.control(invitation.name, Validators.required),
            password: this.fb.control(null, [
              Validators.required,
              Validators.min(6),
            ]),
            eula: this.fb.control(false, Validators.requiredTrue),
          });
        },
        (error) => {
          this.loading = false;
          this.error = true;
          this.showError(error);
        }
      );
    } else {
      this.error = true;
      this.showError(
        'No invitation found! Please try again with a new invitation link.'
      );
    }
  }

  showError(msg: string) {
    const snackBarRef = this.snackbar.open(msg, 'OKAY');

    snackBarRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/auth/login']));
  }

  onRegister() {
    this.loading = true;
    this.authService
      .registerUser({
        name: this.registerForm.controls.name.value,
        password: this.registerForm.controls.password.value,
        invitation: this.invitation,
      })
      .then(() => {
        this.loading = false;

        // Show success modal
        const dialogRef = this.dialog.open(InfoModalComponent, {
          data: {
            title: 'User Created',
            message:
              'Your user profile has been created successfully! Now you can log in.',
          },
        });
        dialogRef
          .afterClosed()
          .subscribe(() => this.router.navigate(['/auth/login']));
      })
      .catch((err) => {
        this.showError(err);
      });
  }
}
