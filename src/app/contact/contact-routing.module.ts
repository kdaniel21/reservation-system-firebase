import { ContactViewComponent } from './contact-view/contact-view.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactUserComponent } from './contact-user/contact-user.component';
import { ContactViewResolver } from './contact-view/contact-view.resolver';

const routes = [
  {
    path: '',
    component: ContactUserComponent,
  },
  {
    path: 'view/:id',
    component: ContactViewComponent,
    resolve: { res: ContactViewResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
