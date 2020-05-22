import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as ReservationActions from './reservation.actions';
import { map, switchMap, withLatestFrom, tap, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  ReservationService,
  ReservationInterface,
} from '../reservation.service';
import { Reservation } from '../reservation.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as fromReservation from './reservation.reducer';
import { ReservationEditService } from '../reservation-edit/reservation-edit.service';

@Injectable()
export class ReservationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient,
    private resService: ReservationService,
    private resEditService: ReservationEditService
  ) {}

  // Gets week data from the server (automatically with SetCurrWeekStart)
  @Effect()
  getWeekData = this.actions$.pipe(
    ofType(ReservationActions.GET_WEEK, ReservationActions.SET_CURR_WEEK_START),
    withLatestFrom(this.store.select('reservation')),
    switchMap(
      ([actionData, reservationState]: [
        ReservationActions.GetWeek,
        fromReservation.State
      ]) => {
        const currYear = reservationState.currentWeekStartingDate.getFullYear();
        const formattedDate = this.resService.formatDateToString(
          reservationState.currentWeekStartingDate
        );
        return this.http.get<[ReservationInterface]>(
          `https://reservation-system-81981.firebaseio.com/calendar/${currYear}/${formattedDate}.json`
        );
      }
    ),
    map((resData: [ReservationInterface]) => {
      if (!resData) {
        // return empty array if there are no reservations for the week
        return [];
      }
      return this.resService.transformToArray(resData);
    }),
    map(
      (reservations: Reservation[]) =>
        new ReservationActions.SetWeek(reservations)
    )
  );

  @Effect()
  nextWeek = this.actions$.pipe(
    ofType(ReservationActions.NEXT_WEEK),
    withLatestFrom(this.store.select('reservation')),
    map(
      ([actionData, reservationState]: [
        ReservationActions.NextWeek,
        fromReservation.State
      ]) => {
        const currWeek = new Date(reservationState.currentWeekStartingDate);
        const nextWeek = currWeek.getDate() + 7;
        currWeek.setDate(nextWeek);

        return new ReservationActions.SetCurrWeekStart(currWeek);
      }
    )
  );

  @Effect()
  previousWeek = this.actions$.pipe(
    ofType(ReservationActions.PREVIOUS_WEEK),
    withLatestFrom(this.store.select('reservation')),
    map(
      ([actionData, reservationState]: [
        ReservationActions.NextWeek,
        fromReservation.State
      ]) => {
        const currWeek = new Date(reservationState.currentWeekStartingDate);
        const nextWeek = currWeek.getDate() - 7;
        currWeek.setDate(nextWeek);

        return new ReservationActions.SetCurrWeekStart(currWeek);
      }
    )
  );

  // Save edited changes onto the server
  @Effect()
  submitEditChanges = this.actions$.pipe(
    ofType(ReservationActions.SUBMIT_EDIT),
    withLatestFrom(this.store.select('reservation')),
    switchMap(
      ([actionData, resState]: [
        ReservationActions.SubmitEdit,
        fromReservation.State
      ]) => {
        const editedReservation = actionData.payload.reservation;

        // Update loaded reservations
        const updatedReservations = [...resState.currentWeekReservations];
        updatedReservations.find((res, index) => {
          if (res.id === editedReservation.id) {
            updatedReservations[index] = editedReservation;
          }
        });

        // Save on the server
        return this.resEditService
          .saveEditChanges(
            editedReservation,
            actionData.payload.originalStartDate
          )
          .pipe(map(() => new ReservationActions.SetWeek(updatedReservations)));
      }
    )
  );

  @Effect({ dispatch: false })
  createNewReservation = this.actions$.pipe(
    ofType(ReservationActions.NEW_RESERVATION),
    switchMap((actionData: ReservationActions.NewReservation) => {
      // Save onto the server
      return this.resEditService.createNewReservation({
        ...actionData.payload,
      });
    }),
    switchMap((reservation: Reservation) =>
      this.resEditService.saveReservationToUserProfile(reservation)
    )
  );

  @Effect()
  deleteReservation = this.actions$.pipe(
    ofType(ReservationActions.START_DELETE_RESERVATION),
    // Delete on the server
    map(
      (actionData: ReservationActions.StartDeleteReservation) =>
        actionData.payload
    ),
    switchMap((reservation) => {
      return this.resEditService
        .deleteReservation(reservation)
        .pipe(map(() => reservation));
    }),
    // Delete in the state
    map(
      (reservation: Reservation) =>
        new ReservationActions.DeleteReservation(reservation)
    )
  );
}
