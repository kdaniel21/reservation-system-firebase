import { Component } from '@angular/core';
import { AdminUserInviteComponent } from './admin-user-invite/admin-user-invite.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  constructor(private dialog: MatDialog) {}

  onInviteUser() {
    this.dialog.open(AdminUserInviteComponent, {
      width: '35%',
      height: '34%',
    });
  }
}
