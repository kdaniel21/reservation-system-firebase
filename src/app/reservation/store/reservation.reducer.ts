import * as ReservationActions from './reservation.actions';
import { Reservation } from '../reservation.model';

const initialState = {
  currentWeekStartingDate: null,
  currentWeek: null,
  currentWeekReservations: null,
  editedReservation: null,
};

export interface State {
  currentWeekStartingDate: Date;
  currentWeek: [];
  currentWeekReservations: Reservation[];
  editedReservation: Reservation;
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
    default:
      return state;
  }
}
