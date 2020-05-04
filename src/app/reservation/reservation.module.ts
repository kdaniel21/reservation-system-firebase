import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { DailyEventsPipe } from './events.pipe';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDayviewComponent } from './reservation-dayview/reservation-dayview.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ReservationMaterialModule } from './reservation-material.module';

@NgModule({
  declarations: [
    ReservationComponent,
    DailyEventsPipe,
    ReservationListComponent,
    ReservationDayviewComponent,
    ReservationEditComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    ReactiveFormsModule,
    NgbModule,
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
