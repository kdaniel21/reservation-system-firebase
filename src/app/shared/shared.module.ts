import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { SharedMaterialModule } from './shared-material.module';



@NgModule({
  declarations: [
    SidebarComponent,
    ConfirmationModalComponent,
    InfoModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialModule
  ],
  exports: [
    SidebarComponent,
    ConfirmationModalComponent,
    InfoModalComponent
  ],
  entryComponents: [InfoModalComponent]
})
export class SharedModule { }
