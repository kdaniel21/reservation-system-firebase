import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Subscription } from 'rxjs';
import { ReservationService } from '../reservation.service';

import * as ReservationActions from '../store/reservation.actions';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css'],
})
export class ReservationListComponent implements OnInit, OnDestroy {
  loading: boolean;
  // Subscriptions
  storeSub: Subscription;
  loadingSub: Subscription;
  // days of the week as strings
  daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  startingDayOfWeek: Date; // starting day of the week
  endingDayOfWeek: Date; // ending day of the week (7 days added)

  constructor(
    private store: Store<AppState>,
    public resService: ReservationService
  ) {}

  ngOnInit() {
    this.loadingSub = this.store
      .select('auth')
      .subscribe((authState) => (this.loading = authState.loading));

    this.storeSub = this.store.select('reservation').subscribe((resState) => {
      if (!resState.currentWeekStartingDate) {
        const currWeekStart = this.resService.getFirstDayOfWeek(new Date());
        this.store.dispatch(
          new ReservationActions.SetCurrWeekStart(currWeekStart)
        );
        this.startingDayOfWeek = currWeekStart;
      } else {
        this.startingDayOfWeek = resState.currentWeekStartingDate;
      }

      this.endingDayOfWeek = new Date(
        new Date(this.startingDayOfWeek).setDate(
          this.startingDayOfWeek.getDate() + 6
        )
      );
    });
  }

  calculateWeeksAway(): string {
    const thisWeek = this.resService.getFirstDayOfWeek(new Date()).getTime();
    const selectedWeek = this.resService
      .getFirstDayOfWeek(this.startingDayOfWeek)
      .getTime();
    const diff = (thisWeek - selectedWeek) / 1000; // gives the time difference in seconds
    const weeksDiff = Math.round(diff / 604800) * -1; // 1 week = 604,800 seconds

    if (weeksDiff === 0) {
      return 'Current week';
    } else if (weeksDiff === 1) {
      return 'Next week';
    } else if (weeksDiff === -1) {
      return 'Previous week';
    } else if (weeksDiff === 2) {
      return 'The week after next week';
    } else if (weeksDiff === -2) {
      return 'The week before previous week';
    } else if (weeksDiff > 1) {
      return weeksDiff + ' weeks away';
    } else if (weeksDiff < -1) {
      return Math.abs(weeksDiff) + ' weeks before';
    }
  }

  calculateDate(day: number) {
    const date = new Date(this.startingDayOfWeek);
    date.setDate(this.startingDayOfWeek.getDate() + day);

    return date.getDate();
  }

  previousWeek() {
    // Set the state, which refreshes the template
    this.store.dispatch(new ReservationActions.PreviousWeek());
  }

  nextWeek() {
    // Set the state, which refreshes the template
    this.store.dispatch(new ReservationActions.NextWeek());
  }

  ngOnDestroy() {
    this.storeSub ? this.storeSub.unsubscribe() : null;
    this.loadingSub ? this.loadingSub.unsubscribe() : null;
  }
}
