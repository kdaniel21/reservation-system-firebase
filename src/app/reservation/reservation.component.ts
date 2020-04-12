import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

import * as fromAuth from '../auth/store/auth.reducer';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from './reservation.service';
import * as ReservationActions from './store/reservation.actions';
import { Reservation } from './reservation.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  templateId: number;
  email: string = null;
  authSub: Subscription;
  weeklyDataSub: Subscription;
  currentWeek: Date[];
  currentWeekSchedule: Reservation[];

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.authSub = this.store
      .select('auth')
      .subscribe((authState: fromAuth.State) => {
        this.email = authState.user.email;
      });

    // Set current week as default
    // const currWeek = this.resService.getFirstDayOfWeek(new Date());
    // this.store.dispatch(new ReservationActions.SetCurrWeekStart(currWeek));

  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
