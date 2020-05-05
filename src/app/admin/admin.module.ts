import { AdminContactListComponent } from './admin-dashboard/admin-contact/admin-contact-list/admin-contact-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminMaterialModule } from './admin-material.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminOverviewComponent,
    AdminCurrentReservationComponent,
    AdminCameraComponent,
    AdminNotificationsComponent,
    AdminUsersComponent,
    AdminUsersListComponent,
    AdminUserInviteComponent,
    AdminUsersInfoComponent,
    AdminUserEditComponent,
    AdminContactListComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AdminMaterialModule,
    FlexLayoutModule,
  ],
  entryComponents: [
    AdminUsersInfoComponent,
    AdminUserEditComponent,
    AdminUserInviteComponent,
  ],
})
export class AdminModule {}
