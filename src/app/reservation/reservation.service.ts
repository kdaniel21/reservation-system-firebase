import { Injectable } from "@angular/core";
import { Reservation } from './reservation.model';

export interface ReservationInterface {
  [id: string]: {
    createdBy: string;
    createdTime: Date;
    name: string;
    startTime: Date,
    endTime: Date,
  }
}

@Injectable({providedIn: 'root'})
export class ReservationService {
  // Formats date to YYYY-MM-DD (january = 1 etc.)
  formatDateToString(date: Date) {
    const year = date.getFullYear();
    // pasting a 0 before the number if single digit
    const month = date.getMonth()+1 < 10 ? 0 + String(date.getMonth()+1) : date.getMonth()+1;
    const day = date.getDate() < 10 ? 0 + date.getDate().toString() : date.getDate();

    return year + '-' + month + '-' + day;
  }

  formatStringToDate(date: string) {
    const splittedDate = date.split("-");

    return new Date(+splittedDate[0], +splittedDate[1]-1, +splittedDate[2]);
  }

  // formats http response to Reservation[]
  transformToArray(value: [ReservationInterface]): Reservation[] {
    const reservations: Reservation[] = [];

    Object.keys(value).forEach(key => {
      const newReservation = new Reservation(
        key,
        value[key].createdBy,
        new Date(value[key].createdTime),
        value[key].name,
        new Date(value[key].startTime),
        new Date(value[key].endTime)
      );

      reservations.push(newReservation);
    });

    return reservations;
  }

  // return the first day of the date's week
  getFirstDayOfWeek(userDate: Date) {
    const date = new Date(userDate);
    const diff = date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  // return the day of the date (in the week, Monday = 1, Sunday = 7)
  getDay(date: Date) {
    //console.log('DAY: ', new Date(date).getDay() || 7);
    return new Date(date).getDay() || 7;
  }

  // return the time as string (eg. 16:00)
  stringifyTime(date: Date) {
    return new Date(date).toLocaleTimeString('hu-HU').slice(0, -3);
  }
}
