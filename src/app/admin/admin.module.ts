import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminOverviewComponent } from './admin-dashboard/admin-overview/admin-overview.component';
import { AdminCurrentReservationComponent } from './admin-dashboard/admin-overview/admin-current-reservation/admin-current-reservation.component';
import { AdminCameraComponent } from './admin-dashboard/admin-overview/admin-camera/admin-camera.component';
import { AdminNotificationsComponent } from './admin-dashboard/admin-overview/admin-notifications/admin-notifications.component';
import { AdminUsersComponent } from './admin-dashboard/admin-users/admin-users.component';
import { AdminUsersListComponent } from './admin-dashboard/admin-users/admin-users-list/admin-users-list.component';
import { AdminUserEditComponent } from './admin-dashboard/admin-users/admin-user-edit/admin-user-edit.component';
import { AdminUserInviteComponent } from './admin-dashboard/admin-users/admin-user-invite/admin-user-invite.component';
import { AdminUsersInfoComponent } from './admin-dashboard/admin-users/admin-users-info/admin-users-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminOverviewComponent,
    AdminCurrentReservationComponent,
    AdminCameraComponent,
    AdminNotificationsComponent,
    AdminUsersComponent,
    AdminUsersListComponent,
    AdminUserInviteComponent,
    AdminUsersInfoComponent,
    AdminUserEditComponent
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule, NgbModule, SharedModule],
  entryComponents: [AdminUsersInfoComponent, AdminUserEditComponent, AdminUserInviteComponent],
})
export class AdminModule {}
