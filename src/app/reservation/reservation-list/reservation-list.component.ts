import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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

  constructor(
    private store: Store<AppState>,
    public resService: ReservationService,
    public ngZone: NgZone,
    public router: Router
  ) {}

  onNew() {
    this.ngZone.run(() => this.router.navigateByUrl('/calendar/edit?mode=new'));
  }

  ngOnInit() {
    this.storeSub = this.store.select('reservation').subscribe((resState) => {
      this.loading = resState.loading;
      if (!resState.currentWeekStartingDate) {
        this.startingDayOfWeek = this.resService.getFirstDayOfWeek(new Date());
        this.store.dispatch(
          new ReservationActions.SetWeekStart(this.startingDayOfWeek)
        );
      } else {
        this.startingDayOfWeek = resState.currentWeekStartingDate;
      }
    });
  }

  calculateDate(day: number) {
    const date = new Date(this.startingDayOfWeek);
    date.setDate(this.startingDayOfWeek.getDate() + day);

    return date.getDate();
  }

  onPreviousWeek() {
    // Set the state, which refreshes the template
    this.store.dispatch(new ReservationActions.PreviousWeek());
  }

  onNextWeek() {
    // Set the state, which refreshes the template
    this.store.dispatch(new ReservationActions.NextWeek());
  }

  ngOnDestroy() {
    if (this.storeSub) this.storeSub.unsubscribe();
  }
}
