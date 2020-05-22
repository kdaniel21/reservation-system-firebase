import { ReservationEditGuard } from './reservation-edit/reservation-edit-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ReservationEditResolver } from './reservation-edit/reservation-edit.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ReservationListComponent, pathMatch: 'full' },
      {
        path: 'edit',
        component: ReservationEditComponent,
        canActivate: [ReservationEditGuard],
        resolve: { res: ReservationEditResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ReservationEditResolver],
})
export class ReservationRoutingModule {}
