export class Reservation {
  constructor(
    public id: string,
    public createdBy: string,
    public createdTime: Date,
    public name: string,
    public startTime: Date,
    public endTime: Date,
    public place: { table: boolean; court: boolean },
    public deleted: boolean = false
  ) {}
}
