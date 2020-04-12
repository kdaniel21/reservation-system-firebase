import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from 'src/app/reservation/reservation.service';
import { map } from 'rxjs/operators';
import { Reservation } from 'src/app/reservation/reservation.model';

@Injectable({ providedIn: 'root' })
export class AdminCurrentReservationService {
  constructor(
    private http: HttpClient,
    private resService: ReservationService
  ) {}

  getCurrentReservation() {
    const currWeekStart = this.resService.getFirstDayOfWeek(new Date());
    const formattedCurrWeek = this.resService.formatDateToString(currWeekStart);

    return this.http
      .get(
        `https://reservation-system-81981.firebaseio.com/calendar/${currWeekStart.getFullYear()}/${formattedCurrWeek}.json`
      )
      .pipe(map((reservations: { [name: string]: Reservation } | null) => {
        if (!reservations) {
          return null;
        }
        const currTime = new Date().getTime();

        for (let reservationId of Object.keys(reservations)) {
          // Get current reservation
          const startTime = new Date(reservations[reservationId].startTime).getTime();
          const endTime = new Date(reservations[reservationId].endTime).getTime();

          if (startTime <= currTime && endTime >= currTime) {
            return reservations[reservationId];
          }
        }
        return null;
      }));
  }
}
