export class User {
  constructor(public email: string,
              public id: string,
              public _token: string,
              public _tokenExpTime: number) {}

  get token() {
    if (this._tokenExpTime && this._tokenExpTime > new Date().getTime()) {
      return this._token;
    } else {
      return null;
    }
  }
}
