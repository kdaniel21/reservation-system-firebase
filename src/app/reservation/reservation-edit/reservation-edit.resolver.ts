import { AngularFireAuth } from '@angular/fire/auth';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { ReservationEditService } from './reservation-edit.service';
import * as ReservationActions from '../store/reservation.actions';
import { ReservationService } from '../reservation.service';
import { switchMap, map, take, withLatestFrom } from 'rxjs/operators';
import { Reservation } from '../reservation.model';

@Injectable()
export class ReservationEditResolver implements Resolve<Reservation | null> {
  constructor(
    private store: Store<AppState>,
    private resEditService: ReservationEditService,
    private resService: ReservationService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Reservation | null> | Promise<Reservation | null> {
    const mode = route.queryParams.mode;

    this.store.dispatch(new ReservationActions.SetLoading(true));

    if (mode !== 'edit' || !route.queryParams.id) {
      return this.store.select('auth').pipe(
        take(1),
        withLatestFrom(this.store.select('reservation')),
        map(([authState, resState]) => {
          const startDate = resState.currentWeekStartingDate || new Date();
          startDate.setHours(new Date().getHours() + 1, 0, 0, 0);

          return new Reservation(
            null,
            authState.user ? authState.user.uid : null,
            new Date(),
            authState.user ? authState.user.name + ' - ' : null,
            startDate,
            new Date(startDate.getTime() + 60 * 60 * 1000),
            { table: false, court: false },
            false,
            null
          );
        })
      );
    } else {
      // Resolver gives the edited item in edit mode
      const id = route.queryParams['id'];

      return this.store.select('reservation').pipe(
        take(1),
        switchMap((resState) => {
          // If the user clicks from the normal calendar, then gives the editedItem from the store (faster)
          if (resState.editedReservation !== null)
            return of(resState.editedReservation);
          else {
            /* If the user reloaded the edit page (no data in Store), then gets data from the
            database and checks if the user is allowed to edit
            + loads the selected week and selects item to edit
            + returns the editedItem */
            return this.resEditService.getReservationById(id).pipe(
              map((reservation) => {
                if (!reservation) return of(null);

                const editedReservation = {
                  ...reservation,
                  id: id,
                  startTime: new Date(reservation.startTime),
                  endTime: new Date(reservation.endTime),
                };

                this.store.dispatch(
                  new ReservationActions.SetWeekStart(
                    this.resService.getFirstDayOfWeek(reservation.startTime)
                  )
                );
                this.store.dispatch(
                  new ReservationActions.StartEdit(editedReservation)
                );

                return editedReservation;
              })
            );
          }
        })
      );
    }
  }
}
