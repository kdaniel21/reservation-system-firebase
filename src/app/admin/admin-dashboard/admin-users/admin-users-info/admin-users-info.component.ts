import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-users-info',
  templateUrl: './admin-users-info.component.html',
})
export class AdminUsersInfoComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private authService: AuthService
  ) {
    // Calculate registration date
    this.data.user.registered = new Date(
      this.data.user.registered.seconds * 1000
    );
    this.data.user.registeredBy = this.authService.getDisplayName(
      this.data.user.registeredBy
    );
  }
}
