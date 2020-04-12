import { User } from '../user.model';

import * as AuthActions from './auth.actions';

const initialState = {
  user: null
}

export interface State {
  user: User
}

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch(action.type) {
    // login: adds user data to storage
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.localId,
        action.payload.token,
        action.payload.tokenExpirationTime
      );
      return {
        ...state,
        user: user
      };
    // logout: deletes user data from store
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }
    default:
      return state;
  }
}
