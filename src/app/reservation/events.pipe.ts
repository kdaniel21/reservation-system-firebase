import { Pipe, PipeTransform } from "@angular/core";
import { Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';

@Pipe({
  name: "dailyEventsPipe"
})
export class DailyEventsPipe implements PipeTransform {

  constructor(private resService: ReservationService) {}

  transform(day: number, reservations: Reservation[]): any {
    return reservations.filter(reservations => {
      return this.resService.getDay(reservations.startTime) == day ? true : false;
    })
  }
}
