import { Action } from '@ngrx/store';
import { Reservation } from '../reservation.model';

// Set the UI
export const SET_WEEK = '[Reservation] Set Weekly Data';
export const SET_WEEK_START = '[Reservation] Set Week Start Date';
export const NEXT_WEEK = '[Reservation] Switch To Next Week';
export const PREVIOUS_WEEK = '[Reservation] Switch To Previous Week';
export const TOGGLE_FILTER = '[Reservation] Toggle Filter';
// EDIT RESERVATION
export const START_EDIT = '[Reservation] Start Edit Reservation';
export const SUBMIT_EDIT = '[Reservation] Submit Edited Reservation';
export const SUBMIT_EDIT_RECURRING =
  '[Reservation] Submit Edited Recurring Reservation';
export const EDIT = '[Reservation] Edit a Single Reservation';
export const CANCEL_EDIT = '[Reservation] Cancel Edited Reservation';
// NEW RESERVATION
export const START_CREATE = '[Reservation] Create New Reservation';
export const START_CREATE_RECURRING =
  '[Reservation] Create New Recurring Reservation';
export const CREATE = '[Reservation] Create a Single Reservation';
// DELETE RESERVATION
export const START_DELETE_RECURRING =
  '[Reservation] Delete a Recurring Reservation';
export const DELETE = '[Reservation] Delete a Reservation';

// Set the UI
export class SetWeek implements Action {
  readonly type = SET_WEEK;

  constructor(public payload: Reservation[]) {}
}

export class SetWeekStart implements Action {
  readonly type = SET_WEEK_START;

  constructor(public payload: Date) {}
}

export class NextWeek implements Action {
  readonly type = NEXT_WEEK;
}

export class PreviousWeek implements Action {
  readonly type = PREVIOUS_WEEK;
}

export class ToggleFilter implements Action {
  readonly type = TOGGLE_FILTER;

  constructor(public payload: string) {} // name of the filter (table or court)
}

// Edit Reservation
export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload: Reservation) {}
}

export class SubmitEdit implements Action {
  readonly type = SUBMIT_EDIT;

  constructor(
    public payload: { reservation: Reservation; originalStartDate: Date }
  ) {}
}

export class SubmitEditRecurring implements Action {
  readonly type = SUBMIT_EDIT_RECURRING;

  constructor(public payload: Reservation) {}
}

export class Edit implements Action {
  readonly type = EDIT;

  constructor(public payload: Reservation) {}
}

export class CancelEdit implements Action {
  readonly type = CANCEL_EDIT;
}

// New Reservation
export class StartCreate implements Action {
  readonly type = START_CREATE;

  constructor(public payload: Reservation) {}
}
export class StartCreateRecurring implements Action {
  readonly type = START_CREATE_RECURRING;

  constructor(public payload: Reservation) {}
}

export class Create implements Action {
  readonly type = CREATE;

  constructor(public payload: Reservation) {}
}

// Delete Reservation
export class StartDeleteRecurring implements Action {
  readonly type = START_DELETE_RECURRING;

  constructor(public payload: Reservation) {}
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: string) {} // ID of the reservation
}

export type ReservationActions =
  | SetWeek
  | SetWeekStart
  | NextWeek
  | PreviousWeek
  | ToggleFilter
  | StartEdit
  | SubmitEdit
  | SubmitEditRecurring
  | Edit
  | CancelEdit
  | StartCreate
  | StartCreateRecurring
  | Create
  | StartDeleteRecurring
  | Delete;
