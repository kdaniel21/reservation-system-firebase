import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from 'src/app/shared/info-modal/info-modal.component';

@Component({
  selector: 'app-auth-register-user',
  templateUrl: './auth-register-user.component.html',
})
export class AuthRegisterUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  loading;
  error;
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
            password: this.fb.control(null, [Validators.required, Validators.min(6)]),
            eula: this.fb.control(false, Validators.requiredTrue),
          });
        },
        (error) => {
          this.loading = false;
          this.error = error;
        }
      );
    } else {
      this.error =
        'No invitation found! Please try again with a new invitation link.';
    }
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
        const elementRef = this.modalService.open(InfoModalComponent, {
          size: 'sm',
        });
        elementRef.componentInstance.title = 'User Created';
        elementRef.componentInstance.message =
          'Your user profile has been created successfully! Now you can log in.';

        elementRef.result
          .then(() => this.router.navigate(['/auth/login']))
          .catch(() => this.router.navigate(['/auth/login']));
      });
  }
}
