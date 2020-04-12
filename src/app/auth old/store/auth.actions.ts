import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string;
      localId: string;
      token: string;
      tokenExpirationTime: number;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
| LoginStart
| Login
| Logout
| AutoLogin;
