import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Reservation } from '../reservation.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

import * as fromAuth from '../../auth/store/auth.reducer';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../reservation.service';
import { combineLatest } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class ReservationEditService {
  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private resService: ReservationService,
    private afStore: AngularFirestore
  ) {}

  createNewReservation(newReservation: Reservation) {
    return this.store.select('auth').pipe(
      take(1),
      switchMap((authState: fromAuth.State) => {
        const reservation = { ...newReservation };
        // Get logged in user
        const userId = authState.user.uid;

        // Fill missing data
        reservation.createdBy = userId;
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
            map((response) => {
              reservation.id = response.name;
              return reservation;
            })
          );
      })
    );
  }

  // Saves the reservation ID to the users profile and returns the reservation
  saveReservationToUserProfile(reservation: Reservation) {
    return this.afStore
      .collection('users')
      .doc(reservation.createdBy)
      .update({
        reservations: firebase.firestore.FieldValue.arrayUnion(reservation.id),
      })
      .then(() => reservation);
  }

  saveEditChanges(editedReservation: Reservation, originalStart: Date) {
    console.log('EDITED: ', editedReservation);
    // Get data to save onto the server
    const year = editedReservation.startTime.getFullYear();
    const formattedStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(editedReservation.startTime)
    );

    // Check if the week was changed
    const formattedOriginalStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(originalStart)
    );

    let deleteReservation;
    if (formattedStartOfWeek !== formattedOriginalStartOfWeek) {
      // Delete previous object from the server
      deleteReservation = this.http.delete(
        `https://reservation-system-81981.firebaseio.com/calendar/${originalStart.getFullYear()}/${formattedOriginalStartOfWeek}/${
          editedReservation.id
        }.json`
      );
    }

    // Save onto the server
    const saveToServer = this.http.put(
      `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}/${editedReservation.id}.json`,
      editedReservation
    );

    return combineLatest(saveToServer, deleteReservation).pipe(take(1));
  }

  deleteReservation(reservation: Reservation) {
    // Get data to access the element on the server
    const year = reservation.startTime.getFullYear();
    const formattedStartOfWeek = this.resService.formatDateToString(
      this.resService.getFirstDayOfWeek(reservation.startTime)
    );

    return this.http.delete(
      `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}/${reservation.id}.json`
    );
  }

  // Checks if user can edit the given reservation
  canUserEdit(reservationId: string, userId: string) {
    return this.afStore
      .collection('users')
      .doc(userId)
      .get()
      .pipe(
        take(1),
        map((user) => user.data().reservations),
        map((reservations: Array<string>) => {
          return reservations.includes(reservationId);
        })
      );
  }

  getReservation(reservationId: string) {
    return this.http
      .get('https://reservation-system-81981.firebaseio.com/calendar.json')
      .pipe(
        take(1),
        map((reservations) => {
          // Loop through the years
          for (let year of Object.keys(reservations)) {
            // Loop through weeks
            for (let week of Object.keys(reservations[year])) {
              // Check if key is in the specific week
              if (
                Object.keys(reservations[year][week]).includes(reservationId)
              ) {
                // If reservation is found, check creator
                return reservations[year][week][reservationId];
              }
            }
          }
          return null;
        })
      );
  }

  // returns the string time as {hour: XX, minute: XX}
  parseTime(time: string): { hours: number; minutes: number } {
    if (!time || time === '') {
      return { hours: 0, minutes: 0 };
    }

    const splittedTime = time.split(':');
    return { hours: +splittedTime[0], minutes: +splittedTime[1] };
  }
}
