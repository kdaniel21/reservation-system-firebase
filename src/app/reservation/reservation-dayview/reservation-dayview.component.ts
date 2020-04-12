import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';
import { Subscription } from 'rxjs';

import * as ReservationActions from '../store/reservation.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-dayview',
  templateUrl: './reservation-dayview.component.html',
  styleUrls: ['./reservation-dayview.component.css']
})
export class ReservationDayviewComponent implements OnInit, OnDestroy {
  @Input('day') dayNumber: number;
  reservationsSub: Subscription;
  dailyReservations: Reservation[];

  constructor(
    private store: Store<AppState>,
    private resService: ReservationService,
    private router: Router
  ) {}

  ngOnInit() {
   this.reservationsSub = this.store.select('reservation').subscribe(reservationState => { // get reservations for the whole week
      if (reservationState.currentWeekReservations) {
        this.dailyReservations = reservationState.currentWeekReservations.filter(
          (reservation: Reservation) => { // filter to the specified day
            return this.resService.getDay(reservation.startTime) == this.dayNumber
              ? true
              : false;
          }
        );
      }
    });
  }

  onEditReservation(id: string) {
    // store edited item in the store
    this.store.dispatch(new ReservationActions.StartEdit(id));
    // redirect to the edit page
    this.router.navigate(['calendar/edit'], {queryParams: {id: id, mode: 'edit'}, });
  }

  ngOnDestroy() {
    this.reservationsSub.unsubscribe();
  }
}
