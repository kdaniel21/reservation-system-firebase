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
      const startTime = this.resEditService.parseTime(control.get('reservation-start-time').value);
      const startDate = control.get('reservation-date').value;
      const length = this.resEditService.parseTime(control.get('reservation-length').value);
      const lengthMs = +length.hour * 3600000 + +length.minute * 60000;

      // Create full dates date
      const fullStartDate = new Date(startDate);
      fullStartDate.setHours(startTime.hour);
      fullStartDate.setMinutes(startTime.minute);
      fullStartDate.setSeconds(0);

      const fullEndDate = new Date(fullStartDate.getTime() + lengthMs);
      fullEndDate.setSeconds(0);

      return this.availabilityService
        .timeAvailable(fullStartDate, fullEndDate)
        .pipe(map(available => (available ? null : { 'Time Reserved': true })));
    };
  }

  constructor(private availabilityService: AvailabilityService, private resEditService: ReservationEditService) {}
}
