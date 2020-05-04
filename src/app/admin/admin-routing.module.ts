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

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: AdminOverviewComponent },
          {
            path: 'users',
            component: AdminUsersComponent,
            children: [
              { path: '', redirectTo: 'list', pathMatch: 'full' },
              { path: 'list', component: AdminUsersListComponent },
              { path: 'edit', component: AdminUserEditComponent },
              { path: 'invite', component: AdminUserInviteComponent },
            ],
          },
          { path: 'messages', component: AdminContactComponent, children: [
            // { path: 'view/:id', component: AdminContactView}
          ]},
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
