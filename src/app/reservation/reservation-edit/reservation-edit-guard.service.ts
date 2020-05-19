import { CancelEdit } from './../store/reservation.actions';
import { ReservationEditService } from './reservation-edit.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ReservationEditGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private resEditService: ReservationEditService,
    private store: Store<AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (route.queryParams['mode'] === 'new') {
      return true;
    }

    const isAdmin: Observable<boolean> = this.afAuth.authState.pipe(
      switchMap((user) => user.getIdTokenResult()),
      map((idTokenResult) => idTokenResult.claims.admin)
    );

    const reservationId = route.queryParams['id'];
    const isCreator = this.afAuth.authState.pipe(
      switchMap((user) =>
        this.resEditService.canUserEdit(reservationId, user.uid)
      )
    );

    return combineLatest(isAdmin, isCreator).pipe(
      take(1),
      map(([isAdmin, isCreator]) => {
        if (!(isAdmin || isCreator)) {
          this.store.dispatch(new CancelEdit());
        }
        return isAdmin || isCreator;
      })
    );
  }
}
