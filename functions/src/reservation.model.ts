export interface Reservation {
  id: string;
  createdBy: string;
  createdTime: Date;
  name: string;
  startTime: Date;
  endTime: Date;
  place: { [placeName: string]: boolean };
  deleted: boolean;
  recurringId?: string;
}

export interface ReservedPlace {
  [timeString: string]: string;
}
