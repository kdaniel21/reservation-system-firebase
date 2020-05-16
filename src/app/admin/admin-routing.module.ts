import { AdminBlogListComponent } from './admin-dashboard/admin-blog/admin-blog-list/admin-blog-list.component';
import { AdminContactListComponent } from './admin-dashboard/admin-contact/admin-contact-list/admin-contact-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminOverviewComponent } from './admin-dashboard/admin-overview/admin-overview.component';
import { AdminUsersComponent } from './admin-dashboard/admin-users/admin-users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'messages', component: AdminContactListComponent },
      { path: 'blog', component: AdminBlogListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
