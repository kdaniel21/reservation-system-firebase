import { withLatestFrom } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';
import { Subscription, combineLatest } from 'rxjs';

import * as ReservationActions from '../store/reservation.actions';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user.model';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-reservation-dayview',
  templateUrl: './reservation-dayview.component.html',
  styleUrls: ['./reservation-dayview.component.css'],
})
export class ReservationDayviewComponent implements OnInit, OnDestroy {
  @Input('day') dayNumber: number;
  sub: Subscription;
  user: User;
  dailyReservations: Reservation[];

  constructor(
    private store: Store<AppState>,
    public resService: ReservationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.dayNumber === 1)
      this.store.dispatch(new AuthActions.SetLoading(true));

    const userSelect = this.store.select('auth');
    const reservationSelect = this.store.select('reservation');

    this.sub = combineLatest([userSelect, reservationSelect]).subscribe(
      ([authState, resState]) => {
        if (!authState.loggedIn || !resState.currentWeekReservations) return;
        // get reservations for the whole week
        this.user = authState.user;

        // filter to the specified day
        const reservations = resState.currentWeekReservations.filter(
          (reservation: Reservation) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const madeByUserOrNotPast =
              this.user.admin ||
              reservation.createdBy === this.user.uid ||
              reservation.startTime.getTime() > today.getTime();

            const notDeleted = this.user.admin || !reservation.deleted;

            const thisDay =
              this.resService.getDay(reservation.startTime) === this.dayNumber;

            const filter =
              (reservation.place.court && resState.filter.court) ||
              (reservation.place.table && resState.filter.table);

            return madeByUserOrNotPast && thisDay && notDeleted && filter;
          }
        );
        // sort by start time
        this.dailyReservations = reservations.sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime()
        );
      }
    );
  }

  onEditReservation(id: string) {
    // store edited item in the store
    this.store.dispatch(new ReservationActions.StartEdit(id));
    // redirect to the edit page
    this.router.navigate(['calendar/edit'], {
      queryParams: { id: id, mode: 'edit' },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
