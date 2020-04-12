export class User {
  constructor(
    public uid: string,
    public email: string,
    public name: string,
    public admin: boolean,
    public registered?: Date,
    public registeredBy?: string,
    public disabled?: boolean,
    public reservations?: Array<string>
  ) {}
}
