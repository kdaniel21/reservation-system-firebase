import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactUserComponent } from './contact-user/contact-user.component';

const routes = [
  { path: '', component: ContactUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}
