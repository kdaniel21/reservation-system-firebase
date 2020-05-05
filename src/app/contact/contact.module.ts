import { ContactViewComponent } from './contact-view/contact-view.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { ContactMaterialModule } from './contact-material.module';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactUserComponent } from './contact-user/contact-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactHistoryComponent } from './contact-history/contact-history.component';


@NgModule({
  declarations: [
    ContactUserComponent,
    ContactHistoryComponent,
    ContactViewComponent
  ],
  imports: [
    CommonModule,
    ContactMaterialModule,
    ContactRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  entryComponents: [ContactHistoryComponent]
})
export class ContactModule {}
