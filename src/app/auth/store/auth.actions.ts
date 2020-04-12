import { Action } from '@ngrx/store';
import { User } from '../user.model';

export const LOGIN = '[Auth] Login';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const GET_USER = '[Auth] Get User';
export const AUTHENTICATED = '[Auth] Authenticated';
export const NOT_AUTHENTICATED = '[Auth] Not Authenticated';
export const LOGOUT = '[Auth] Logout';
export const AUTH_ERROR = '[Auth] Error';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: { email: string; password: string }) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class GetUser implements Action {
  readonly type = GET_USER;
  // constructor(public payload)
}

export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public payload: User) {}
}

export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;

  constructor(public payload: string) {}
}

export type AuthActions =
  | Login
  | AutoLogin
  | GetUser
  | Authenticated
  | NotAuthenticated
  | Logout
  | AuthError;
