import { AdminContactViewResolver } from './admin-dashboard/admin-contact/admin-contact-view/admin-contact-view.resolver';
import { AdminContactListComponent } from './admin-dashboard/admin-contact/admin-contact-list/admin-contact-list.component';
import { AdminContactComponent } from './admin-dashboard/admin-contact/admin-contact.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminOverviewComponent } from './admin-dashboard/admin-overview/admin-overview.component';
import { AdminUsersComponent } from './admin-dashboard/admin-users/admin-users.component';
import { AdminUserEditComponent } from './admin-dashboard/admin-users/admin-user-edit/admin-user-edit.component';
import { AdminUsersListComponent } from './admin-dashboard/admin-users/admin-users-list/admin-users-list.component';
import { AdminUserInviteComponent } from './admin-dashboard/admin-users/admin-user-invite/admin-user-invite.component';
import { AdminContactViewComponent } from './admin-dashboard/admin-contact/admin-contact-view/admin-contact-view.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'users', component: AdminUsersComponent },
      {
        path: 'messages',
        component: AdminContactComponent,
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: AdminContactListComponent },
          {
            path: 'view/:id',
            component: AdminContactViewComponent,
            resolve: { res: AdminContactViewResolver },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
