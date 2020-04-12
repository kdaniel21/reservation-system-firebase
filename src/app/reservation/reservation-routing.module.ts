import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationEditResolver } from './reservation-edit/reservation-edit.resolver';

const routes: Routes = [
  {
    path: '',
    component: ReservationComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ReservationListComponent },
      { path: 'edit', component: ReservationEditComponent, resolve: { res: ReservationEditResolver } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ReservationEditResolver]
})
export class ReservationRoutingModule {}
