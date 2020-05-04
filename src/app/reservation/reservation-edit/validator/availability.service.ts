import { Injectable } from '@angular/core';
import {
  ReservationService,
  ReservationInterface,
} from '../../reservation.service';
import { HttpClient } from '@angular/common/http';
import { map, withLatestFrom } from 'rxjs/operators';
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
            const editedId = resState.editedReservation
              ? resState.editedReservation.id
              : true;

            if (editedId === true || res.id !== editedId) {
              // to not compare milliseconds
              const start1 = Math.floor(startTime.getTime() / 1000);
              const start2 = Math.floor(res.startTime.getTime() / 1000);
              const end1 = Math.floor(endTime.getTime() / 1000);
              const end2 = Math.floor(res.endTime.getTime() / 1000);

              /* compare times:
              a start and end can be the same of two different reservations
              e.g. one is 19.00-20.00 and other can be 20.00-21.00 */
              if (
                (start1 >= start2 && start1 < end2) ||
                (start2 >= start1 && start2 < end1)
              ) {
                available = false;
              }
            }
          });

          return available;
        })
      );
  }
}
