import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AvailabilityService } from './availability.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReservationEditService } from '../reservation-edit.service';

@Injectable({ providedIn: 'root' })
export class TimeAvailabilityValidator {
  availableValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      // Get data of fields
      const startTime = this.resEditService.parseTime(
        control.get('full-date.start').value
      );
      const startDate = control.get('full-date.date').value;
      const length = control.get('full-date.length').value;
      const lengthMs = +length.hours * 3600000 + +length.minutes * 60000;

      // Create full start date
      const fullStartDate = new Date(startDate);
      fullStartDate.setHours(startTime.hours);
      fullStartDate.setMinutes(startTime.minutes);
      fullStartDate.setSeconds(0);

      const fullEndDate = new Date(fullStartDate.getTime() + lengthMs);
      fullEndDate.setSeconds(0);

      const place = {
        table: control.get('place.table').value,
        court: control.get('place.court').value,
      };

      return this.availabilityService
        .timeAvailable(fullStartDate, fullEndDate, place)
        .pipe(
          map((available) => (available ? null : { 'Time Reserved': true }))
        );
    };
  }

  constructor(
    private availabilityService: AvailabilityService,
    private resEditService: ReservationEditService
  ) {}
}
