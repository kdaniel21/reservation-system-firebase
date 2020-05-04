import { TimepickerInputComponent } from './timepicker-input/timepicker-input.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { SharedMaterialModule } from './shared-material.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SidebarComponent,
    ConfirmationModalComponent,
    InfoModalComponent,
    LoadingSpinnerComponent,
    TimepickerInputComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    ConfirmationModalComponent,
    InfoModalComponent,
    LoadingSpinnerComponent,
    TimepickerInputComponent
  ],
  entryComponents: [InfoModalComponent]
})
export class SharedModule { }
