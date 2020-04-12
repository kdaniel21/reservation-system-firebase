import { Injectable } from '@angular/core';
import { Reservation } from '../reservation.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

import * as fromAuth from '../../auth/store/auth.reducer';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../reservation.service';
import { take, map, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReservationEditService {
  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private resService: ReservationService
  ) {}

  createNewReservation(newReservation: Reservation) {
    return this.store.select('auth').pipe(
      switchMap((authState: fromAuth.State) => {
        const reservation = { ...newReservation };
        // Get logged in user
        const user = authState.user.uid;

        // Fill missing data
        reservation.createdBy = user;
        reservation.createdTime = new Date();

        // Get data to save onto the server
        const year = reservation.startTime.getFullYear();
        const formattedStartOfWeek = this.resService.formatDateToString(
          this.resService.getFirstDayOfWeek(reservation.startTime)
        );

        // Save onto the server
        return this.http
          .post<Reservation>(
            `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}.json`,
            reservation
          )
          .pipe(
            map(response => {
              // Add the id to the reservation object
              reservation.id = response.name;
              return reservation;
            })
          );
      })
    );
  }

  saveEditChanges(editedReservation: Reservation, originalStart: Date) {
    // Get data to save onto the server
    const year = editedReservation.startTime.getFullYear();
    const formattedStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(editedReservation.startTime)
    );

    // Check if the week was changed
    const formattedOriginalStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(originalStart)
    );
    if (formattedStartOfWeek !== formattedOriginalStartOfWeek) {
      // Delete previous object from the server
      this.http
        .delete(
          `https://reservation-system-81981.firebaseio.com/calendar/${originalStart.getFullYear()}/${formattedOriginalStartOfWeek}/${
            editedReservation.id
          }.json`
        )
        .pipe(take(1))
        .subscribe();
    }

    // Save onto the server
    this.http
      .put(
        `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}/${editedReservation.id}.json`,
        editedReservation
      )
      .pipe(take(1))
      .subscribe();

    return editedReservation;
  }

  deleteReservation(reservation: Reservation) {
    // Get data to access the element on the server
    const year = reservation.startTime.getFullYear();
    const formattedStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(reservation.startTime)
    );

    this.http
      .delete(
        `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}/${reservation.id}.json`
      )
      .pipe(take(1))
      .subscribe();
  }

  // Checks if user can edit the given reservation
  canUserEdit(reservation_id: string) {
    const user_id = JSON.parse(localStorage.getItem('user')).id;

    return this.http
      .get('https://reservation-system-81981.firebaseio.com/calendar.json')
      .pipe(
        take(1),
        map(reservations => {
          // Loop through the years
          for (let year of Object.keys(reservations)) {
            // Loop through weeks
            for (let week of Object.keys(reservations[year])) {
              // Check if key is in the specific week
              if (
                Object.keys(reservations[year][week]).indexOf(reservation_id) >
                -1
              ) {
                // If reservation is found, check creator
                if (
                  reservations[year][week][reservation_id].createdBy === user_id
                ) {
                  return reservations[year][week][reservation_id];
                }
              }
            }
          }
          return null;
        })
      );
  }
}
