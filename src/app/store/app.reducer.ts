import * as fromAuth from '../auth/store/auth.reducer';
import * as fromReservation from '../reservation/store/reservation.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuth.State,
  reservation: fromReservation.State
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  reservation: fromReservation.reservationReducer
}
