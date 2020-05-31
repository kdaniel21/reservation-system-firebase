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

  // Start loading
  @Effect()
  startLoading = this.actions$.pipe(
    ofType(
      ReservationActions.SET_WEEK_START,
      ReservationActions.NEXT_WEEK,
      ReservationActions.PREVIOUS_WEEK,
      ReservationActions.SUBMIT_EDIT,
      ReservationActions.SUBMIT_EDIT_RECURRING,
      ReservationActions.SUBMIT_EDIT,
      ReservationActions.SUBMIT_EDIT_RECURRING,
      ReservationActions.START_CREATE,
      ReservationActions.START_CREATE_RECURRING,
      ReservationActions.START_DELETE_RECURRING
    ),
    map(() => new ReservationActions.SetLoading(true))
  );

  // Gets data from the server if new week is set
  @Effect()
  getWeekData = this.actions$.pipe(
    ofType(ReservationActions.SET_WEEK_START),
    switchMap((action: ReservationActions.SetWeekStart) =>
      this.http
        .get<[ReservationInterface]>(
          this.resService.getRequestUrl(action.payload)
        )
        .pipe(
          map(
            (resData) =>
              new ReservationActions.SetWeek(
                this.resService.transformToArray(resData)
              )
          )
        )
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
        const selectedWeek = new Date(reservationState.currentWeekStartingDate);
        const nextWeek = new Date(
          selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000
        );

        return new ReservationActions.SetWeekStart(nextWeek);
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
        const selectedWeek = new Date(reservationState.currentWeekStartingDate);
        const previousWeek = new Date(
          selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        return new ReservationActions.SetWeekStart(previousWeek);
      }
    )
  );

  // Save edited changes onto the server
  @Effect()
  submitEditChanges = this.actions$.pipe(
    ofType(ReservationActions.SUBMIT_EDIT),
    switchMap((actionData: ReservationActions.SubmitEdit) => {
      // Save on the server
      return this.resEditService
        .saveEditChanges(
          actionData.payload.reservation,
          actionData.payload.originalStartDate
        )
        .pipe(
          map(() => new ReservationActions.Edit(actionData.payload.reservation))
        );
    })
  );

  @Effect()
  submitEditRecurring = this.actions$.pipe(
    ofType(ReservationActions.SUBMIT_EDIT_RECURRING),
    switchMap((action: ReservationActions.SubmitEditRecurring) => {
      return this.resEditService
        .saveRecurringChanges(action.payload)
        .pipe(map(() => new ReservationActions.Edit(action.payload)));
    })
  );

  @Effect()
  createNewReservation = this.actions$.pipe(
    ofType(ReservationActions.START_CREATE),
    switchMap((actionData: ReservationActions.StartCreate) =>
      this.resEditService.createNewReservation({
        ...actionData.payload,
      })
    ),
    switchMap((reservation: Reservation) =>
      this.resEditService.saveReservationToUserProfile(reservation)
    ),
    map(
      (reservation: Reservation) => new ReservationActions.Create(reservation)
    )
  );

  @Effect()
  createRecurring = this.actions$.pipe(
    ofType(ReservationActions.START_CREATE_RECURRING),
    switchMap((actionData: ReservationActions.StartCreateRecurring) => {
      return this.resEditService.createRecurringReservation(actionData.payload);
    }),
    map(
      (reservation: Reservation) => new ReservationActions.Create(reservation)
    )
  );

  @Effect()
  deleteRecurring = this.actions$.pipe(
    ofType(ReservationActions.START_DELETE_RECURRING),
    switchMap((actionData: ReservationActions.StartDeleteRecurring) => {
      return this.resEditService
        .deleteRecurringReservation(actionData.payload)
        .pipe(map(() => new ReservationActions.Delete(actionData.payload.id)));
    })
  );
}
