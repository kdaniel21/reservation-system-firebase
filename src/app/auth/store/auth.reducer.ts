import { User } from '../user.model';

import * as AuthActions from './auth.actions';

const initialState = {
  user: null,
  loggedIn: false,
  loading: false,
  errorMsg: null,
};

export interface State {
  user: User;
  loggedIn: boolean;
  loading: boolean;
  errorMsg: string;
}

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATED:
      return {
        ...state,
        user: action.payload,
        loggedIn: true,
      };
    case AuthActions.NOT_AUTHENTICATED:
      return {
        ...state,
        user: null,
        loggedIn: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.AUTH_ERROR:
      return {
        ...state,
        errorMsg: action.payload,
      };
    case AuthActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state;
  }
}
