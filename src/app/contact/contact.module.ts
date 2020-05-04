import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { ContactMaterialModule } from './contact-material.module';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactUserComponent } from './contact-user/contact-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ContactUserComponent
  ],
  imports: [
    CommonModule,
    ContactMaterialModule,
    ContactRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: []
})
export class ContactModule {}
