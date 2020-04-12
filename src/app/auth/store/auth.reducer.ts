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
    case AuthActions.GET_USER:
      return {
        ...state,
        loading: true,
      };
    case AuthActions.AUTHENTICATED:
      console.log('User authenticated!');
      return {
        ...state,
        user: action.payload,
        loggedIn: true,
        loading: false,
      };
    case AuthActions.NOT_AUTHENTICATED:
      return {
        ...state,
        user: null,
        loggedIn: false,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        loading: true,
      };
    case AuthActions.AUTH_ERROR:
      return {
        ...state,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
}
