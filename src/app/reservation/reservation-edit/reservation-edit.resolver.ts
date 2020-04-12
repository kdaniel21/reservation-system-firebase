import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { ReservationEditService } from './reservation-edit.service';
import * as ReservationActions from '../store/reservation.actions';
import { ReservationService } from '../reservation.service';
import { switchMap, map, tap, take, delay } from 'rxjs/operators';

@Injectable()
export class ReservationEditResolver implements Resolve<any> {
  constructor(
    private store: Store<AppState>,
    private resEditService: ReservationEditService,
    private resService: ReservationService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // Resolver gives the edited item in edit mode
    if (route.queryParams['mode'] === 'edit') {
      const id = route.queryParams['id'];

      return this.store.select('reservation').pipe(
        take(1),
        switchMap(resState => {
          // If the user clicks from the normal calendar, then gives the editedItem from the store (faster)
          if (resState.editedReservation !== null) {
            return of(resState.editedReservation);
          } else {
            /* If the user reloaded the edit page (no data in Store), then gets data from the
            database and checks if the user is allowed to edit
            + loads the selected week and selects item to edit
            + gives the editedItem*/
            return this.resEditService.canUserEdit(id).pipe(
              map(canUserEdit => {
                if (canUserEdit) {
                  canUserEdit.id = id;
                  const weekStart = this.resService.getFirstDayOfWeek(
                    canUserEdit.startTime
                  );

                  this.store.dispatch(
                    new ReservationActions.SetCurrWeekStart(weekStart)
                  );

                  return canUserEdit;
                } else {
                  return null;
                }
              }),
              // Delay is because StartEdit would get data from the store, but the data isn't there if they run parallel
              delay(350),
              tap(canUserEdit => {
                if (canUserEdit)
                  this.store.dispatch(
                    new ReservationActions.StartEdit(canUserEdit.id)
                  );
              })
            );
          }
        })
      );
    }
  }
}
