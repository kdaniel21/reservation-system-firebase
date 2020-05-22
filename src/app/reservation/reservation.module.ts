import { ReservationListFilterComponent } from './reservation-list/reservation-list-filter/reservation-list-filter.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDayviewComponent } from './reservation-dayview/reservation-dayview.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ReservationMaterialModule } from './reservation-material.module';

@NgModule({
  declarations: [
    ReservationComponent,
    ReservationListComponent,
    ReservationDayviewComponent,
    ReservationEditComponent,
    ReservationListFilterComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ReservationMaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [
    ReservationComponent
  ],
})
export class ReservationModule { }
