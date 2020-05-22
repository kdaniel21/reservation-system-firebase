import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ToggleFilter } from '../../store/reservation.actions';

@Component({
  selector: 'app-reservation-list-filter',
  templateUrl: './reservation-list-filter.component.html',
  styleUrls: ['./reservation-list-filter.component.css'],
})
export class ReservationListFilterComponent {
  constructor(private store: Store<AppState>) {}

  onFilterChanged(filterName: string) {
    this.store.dispatch(new ToggleFilter(filterName));
  }
}
