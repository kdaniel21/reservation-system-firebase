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

    case ReservationActions.SET_WEEK_START:
      return {
        ...state,
        currentWeekStartingDate: action.payload,
      };

    case ReservationActions.TOGGLE_FILTER:
      const filter = { ...state.filter };
      filter[action.payload] = !filter[action.payload];
      console.log(filter);
      return {
        ...state,
        filter,
      };

    case ReservationActions.START_EDIT:
      return {
        ...state,
        editedReservation: action.payload,
      };

    case ReservationActions.EDIT:
      const reservations = [...state.currentWeekReservations];
      const index = reservations.findIndex(
        (res) => res.id === action.payload.id
      );

      reservations[index] = action.payload;

      return {
        ...state,
        currentWeekReservations: [...reservations],
      };

    case ReservationActions.CANCEL_EDIT:
      return {
        ...state,
        editedReservation: null,
      };

    case ReservationActions.CREATE:
      return {
        ...state,
        currentWeekReservations: [
          ...state.currentWeekReservations,
          action.payload,
        ],
      };

    case ReservationActions.DELETE:
      return {
        ...state,
        currentWeekReservations: [...state.currentWeekReservations].filter(
          (res) => res.id !== action.payload
        ),
      };

    default:
      return state;
  }
}
