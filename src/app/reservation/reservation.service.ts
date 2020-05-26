import { Injectable } from '@angular/core';
import { Reservation } from './reservation.model';

export interface ReservationInterface {
  [id: string]: {
    createdBy: string;
    createdTime: Date;
    name: string;
    startTime: Date;
    endTime: Date;
    place: { table: boolean; court: boolean };
  };
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  // Formats date to YYYY-MM-DD string (january = 1 etc.)
  formatDateToString(date: Date) {
    const year = date.getFullYear();
    // pasting a 0 before the number if single digit
    const month =
      date.getMonth() + 1 < 10
        ? 0 + String(date.getMonth() + 1)
        : date.getMonth() + 1;
    const day =
      date.getDate() < 10 ? 0 + date.getDate().toString() : date.getDate();

    return year + '-' + month + '-' + day;
  }

  formatStringToDate(date: string) {
    const splittedDate = date.split('-');

    return new Date(+splittedDate[0], +splittedDate[1] - 1, +splittedDate[2]);
  }

  // formats http response to Reservation[]
  transformToArray(value: [ReservationInterface]): Reservation[] {
    if (!value) return [];

    const reservations: Reservation[] = [];

    Object.keys(value).forEach((key) => {
      const newReservation = new Reservation(
        key,
        value[key].createdBy,
        new Date(value[key].createdTime),
        value[key].name,
        new Date(value[key].startTime),
        new Date(value[key].endTime),
        { table: value[key].place.table, court: value[key].place.court },
        value[key].deleted,
        value[key].recurringId
      );

      reservations.push(newReservation);
    });

    return reservations;
  }

  // return the first day of the date's week
  getFirstDayOfWeek(userDate: Date) {
    const date = new Date(userDate);
    const diff = date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1);
    date.setHours(0, 0, 0, 0);

    return new Date(date.setDate(diff));
  }

  // return the day of the date (in the week, Monday = 1, Sunday = 7)
  getDay(date: Date) {
    return new Date(date).getDay() || 7;
  }

  // return the time as string (eg. 16:00)
  stringifyTime(date: Date) {
    return new Date(date).toLocaleTimeString('hu-HU').slice(0, -3);
  }

  calculateWeeksAway(startingDayOfWeek): string {
    const thisWeek = this.getFirstDayOfWeek(new Date()).getTime();
    const selectedWeek = this.getFirstDayOfWeek(startingDayOfWeek).getTime();
    const diff = (thisWeek - selectedWeek) / 1000; // gives the time difference in seconds
    const weeksDiff = Math.round(diff / 604800) * -1; // 1 week = 604,800 seconds

    if (weeksDiff === 0) {
      return 'Current week';
    } else if (weeksDiff === 1) {
      return 'Next week';
    } else if (weeksDiff === -1) {
      return 'Previous week';
    } else if (weeksDiff === 2) {
      return 'The week after next week';
    } else if (weeksDiff === -2) {
      return 'The week before previous week';
    } else if (weeksDiff > 1) {
      return weeksDiff + ' weeks away';
    } else if (weeksDiff < -1) {
      return Math.abs(weeksDiff) + ' weeks before';
    }
  }

  /*
  Returns the URL to the reservations
  no arguments -> whole calendar object
  with date -> whole week
  with date & id -> specific reservation
  */
  getRequestUrl(date?: Date, id?: string) {
    if (!date)
      return 'https://reservation-system-81981.firebaseio.com/calendar.json';

    const year = date.getFullYear();
    const formattedStartOfWeek = this.formatDateToString(
      this.getFirstDayOfWeek(date)
    );

    if (id)
      return `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}/${id}.json`;
    else
      return `https://reservation-system-81981.firebaseio.com/calendar/${year}/${formattedStartOfWeek}.json`;
  }
}
