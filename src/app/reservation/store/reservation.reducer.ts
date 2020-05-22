import * as ReservationActions from './reservation.actions';
import { Reservation } from '../reservation.model';

const initialState = {
  currentWeekStartingDate: null,
  currentWeekReservations: null,
  editedReservation: null,
  filter: { table: true, court: true },
};

export interface State {
  currentWeekStartingDate: Date;
  currentWeekReservations: Reservation[];
  editedReservation: Reservation;
  filter: { table: boolean; court: boolean };
}

export function reservationReducer(
  state: State = initialState,
  action: ReservationActions.ReservationActions
) {
  switch (action.type) {
    case ReservationActions.SET_WEEK:
      return {
        ...state,
        editedReservation: null,
        currentWeekReservations: [...action.payload],
      };
    case ReservationActions.SET_CURR_WEEK_START:
      return {
        ...state,
        currentWeekStartingDate: action.payload,
      };
    case ReservationActions.START_EDIT:
      const id = action.payload;
      const editedReservation = [...state.currentWeekReservations].find(
        (res) => res.id == id
      );

      return {
        ...state,
        editedReservation: editedReservation,
      };
    case ReservationActions.DELETE_RESERVATION:
      const deletedReservation = action.payload;
      const currentReservations = [
        ...state.currentWeekReservations,
      ].filter((reservation: Reservation) =>
        reservation.id === deletedReservation.id ? false : true
      );

      return {
        ...state,
        editedReservation: null,
        currentWeekReservations: [...currentReservations],
      };
    case ReservationActions.ADD_RESERVATION:
      return {
        ...state,
        editedReservation: null,
        currentWeekReservations: [
          ...state.currentWeekReservations,
          action.payload,
        ],
      };
    case ReservationActions.CANCEL_EDIT:
      return {
        ...state,
        editedReservation: null,
      };
    case ReservationActions.TOGGLE_FILTER:
      const filter = {...state.filter};
      filter[action.payload] = !filter[action.payload];
      console.log(filter);
      return {
        ...state,
        filter,
      };
    default:
      return state;
  }
}
