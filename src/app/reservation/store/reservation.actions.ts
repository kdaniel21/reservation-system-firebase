import { Action } from '@ngrx/store';
import { Reservation } from '../reservation.model';

export const GET_WEEK = '[Reservation] Get Weekly Data';
export const SET_WEEK = '[Reservation] Set Weekly Data';
export const SET_CURR_WEEK_START =
  '[Reservation] Set Current Week Starting Date';
export const NEXT_WEEK = '[Reservation] Switch To Next Week';
export const PREVIOUS_WEEK = '[Reservation] Switch To Previous Week';
export const START_EDIT = '[Reservation] Start Edit Reservation';
export const SUBMIT_EDIT = '[Reservation] Submit Edited Reservation';
export const CANCEL_EDIT = '[Reservation] Cancel Edited Reservation';
export const NEW_RESERVATION = '[Reservation] Create New Reservation';
export const START_DELETE_RESERVATION =
  '[Reservation] Start Deleting a Reservation';
export const ADD_RESERVATION = '[Reservation] Add a Single Reservation';
export const TOGGLE_FILTER = '[Reservation] Toggle Filter';

export class GetWeek implements Action {
  readonly type = GET_WEEK;
}

export class SetWeek implements Action {
  readonly type = SET_WEEK;

  constructor(public payload: Reservation[]) {}
}

export class SetCurrWeekStart implements Action {
  readonly type = SET_CURR_WEEK_START;

  constructor(public payload: Date) {}
}

export class NextWeek implements Action {
  readonly type = NEXT_WEEK;
}

export class PreviousWeek implements Action {
  readonly type = PREVIOUS_WEEK;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload: string) {} // payload: id-key
}

export class SubmitEdit implements Action {
  readonly type = SUBMIT_EDIT;

  constructor(
    public payload: { reservation: Reservation; originalStartDate: Date }
  ) {}
}

export class NewReservation implements Action {
  readonly type = NEW_RESERVATION;

  constructor(public payload: Reservation) {}
}

export class StartDeleteReservation implements Action {
  readonly type = START_DELETE_RESERVATION;

  constructor(public payload: Reservation) {}
}

export class AddReservation implements Action {
  readonly type = ADD_RESERVATION;

  constructor(public payload: Reservation) {}
}

export class CancelEdit implements Action {
  readonly type = CANCEL_EDIT;
}

export class ToggleFilter implements Action {
  readonly type = TOGGLE_FILTER;

  constructor(public payload: string) {} // name of the filter (table or court)
}

export type ReservationActions =
  | GetWeek
  | SetWeek
  | SetCurrWeekStart
  | NextWeek
  | PreviousWeek
  | StartEdit
  | SubmitEdit
  | NewReservation
  | StartDeleteReservation
  | AddReservation
  | CancelEdit
  | ToggleFilter;
