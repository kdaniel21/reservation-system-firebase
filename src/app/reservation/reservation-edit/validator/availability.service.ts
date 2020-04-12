import { Injectable } from '@angular/core';
import {
  ReservationService,
  ReservationInterface,
} from '../../reservation.service';
import { HttpClient } from '@angular/common/http';
import { map, withLatestFrom, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { State } from '../../store/reservation.reducer';
import { Reservation } from '../../reservation.model';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  constructor(
    private resService: ReservationService,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  timeAvailable(startTime: Date, endTime: Date) {
    // TODO the program doesn't get the id -> comparison not good
    const formattedStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(startTime)
    );
    const year = startTime.getFullYear();

    // Get all reservations from that week
    return this.http
      .get<[ReservationInterface]>(
        `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}.json`
      )
      .pipe(
        map((unformattedReservations) => {
          if (unformattedReservations) {
            return this.resService.transformToArray(unformattedReservations);
          }
          return [];
        }),
        withLatestFrom(this.store.select('reservation')),
        map(([reservations, resState]: [Reservation[], State]) => {
          let available = true;
          reservations.forEach((res) => {
            if (
              res.startTime.getTime() <= startTime.getTime() &&
              res.endTime.getTime() >= endTime.getTime() &&
              res.id !== resState.editedReservation.id
            ) {
              available = false;
            }
          });

          return available;
        })
      );
  }
}
