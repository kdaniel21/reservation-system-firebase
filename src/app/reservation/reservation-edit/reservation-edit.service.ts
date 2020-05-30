import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Reservation } from '../reservation.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

import * as fromAuth from '../../auth/store/auth.reducer';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../reservation.service';
import { combineLatest, of } from 'rxjs';
import { take, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { EditRecurringDialogComponent } from './edit-recurring-dialog/edit-recurring-dialog.component';

@Injectable({ providedIn: 'root' })
export class ReservationEditService {
  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private resService: ReservationService,
    private afStore: AngularFirestore,
    private afFunctions: AngularFireFunctions,
    private dialog: MatDialog
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

        // Save onto the server
        return this.http
          .post<Reservation>(
            this.resService.getRequestUrl(reservation.startTime),
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
    // Get data to save onto the server
    return this.http
      .put(
        this.resService.getRequestUrl(
          editedReservation.startTime,
          editedReservation.id
        ),
        editedReservation
      )
      .pipe(
        withLatestFrom(this.store.select('reservation')),
        switchMap(([res, resState]) => {
          const originalStartOfWeek = resState.currentWeekStartingDate;

          // Delete original reservation if the week has changed
          if (
            originalStartOfWeek ===
            this.resService.getFirstDayOfWeek(editedReservation.startTime)
          )
            return this.http.delete(
              this.resService.getRequestUrl(
                originalStartOfWeek,
                editedReservation.id
              )
            );
          return of(true);
        })
      );
  }

  createRecurringReservation(reservation: Reservation) {
    const res = {
      ...reservation,
      startTime: reservation.startTime.getTime(),
      endTime: reservation.endTime.getTime(),
      createdTime: reservation.createdTime.getTime(),
    };
    return this.afFunctions.httpsCallable('createRecurringReservation')({
      reservation: res,
    });
  }

  saveRecurringChanges(reservation: Reservation) {
    const res = {
      ...reservation,
      startTime: reservation.startTime.getTime(),
      endTime: reservation.endTime.getTime(),
      createdTime: reservation.createdTime.getTime(),
    };
    return this.afFunctions.httpsCallable('saveAllRecurringChanges')({
      reservation: res,
    });
  }

  deleteRecurringReservation(reservation: Reservation) {
    const res = {
      ...reservation,
      startTime: reservation.startTime.getTime(),
      endTime: reservation.endTime.getTime(),
      createdTime: reservation.createdTime.getTime(),
    };
    return this.afFunctions.httpsCallable('deleteRecurringReservation')({
      reservation: res,
    });
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

  getReservationById(reservationId: string) {
    return this.http.get(this.resService.getRequestUrl()).pipe(
      take(1),
      map((reservations) => {
        for (let year of Object.keys(reservations))
          for (let week of Object.keys(reservations[year]))
            if (Object.keys(reservations[year][week]).includes(reservationId))
              return reservations[year][week][reservationId];

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

  // Asks whether user wants to edit all recurring or just that specific one
  modifyAllRecurring() {
    const ref = this.dialog.open(EditRecurringDialogComponent);

    return ref
      .afterClosed()
      .pipe(map((result) => (result === 'every' ? true : false)))
      .toPromise();
  }

  // returns the length in seconds
  calculateLength(time: { hours: number; minutes: number }) {
    return time.hours * 3600 + time.minutes * 60
  }
}
