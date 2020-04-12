import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AvailabilityService } from './availability.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TimeAvailabilityValidator {
  availableValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      // Get data of fields
      const startTime = control.get('reservation-start-time').value;
      const startDate = control.get('reservation-date').value;
      const length = control.get('reservation-length').value;
      const lengthMs = +length.hour * 3600000 + +length.minute * 60000;

      // Create full dates date
      const fullStartDate = new Date(
        startDate.year,
        startDate.month - 1,
        startDate.day,
        startTime.hour,
        startTime.minute
      );
      const fullEndDate = new Date(fullStartDate.getTime() + lengthMs);

      return this.availabilityService
        .timeAvailable(fullStartDate, fullEndDate)
        .pipe(map(available => (available ? null : { 'Time Reserved': true })));
    };
  }

  constructor(private availabilityService: AvailabilityService) {}
}
