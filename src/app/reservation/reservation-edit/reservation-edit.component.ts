import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../reservation.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as ReservationActions from '../store/reservation.actions';
import { ReservationService } from '../reservation.service';
import { Validators, FormBuilder } from '@angular/forms';
import { TimeAvailabilityValidator } from './validator/availability.validator';
import { take, map } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css'],
})
export class ReservationEditComponent implements OnInit {
  // Setting default values
  editMode = false;
  editedItem = new Reservation('', '', new Date(), '', new Date(), new Date());

  // Create the reactive form
  currTime = new Date();
  editForm = this.fb.group({
    'reservation-name': this.fb.control(null, [Validators.required]),
    'reservation-full-date': this.fb.group(
      {
        'reservation-date': this.fb.control({
          year: this.currTime.getFullYear(),
          month: this.currTime.getMonth() + 1,
          day: this.currTime.getDate()
        }),
        'reservation-start-time': this.fb.control({
          hour: this.currTime.getHours() + 1,
          minute: 0,
        }),
        'reservation-length': this.fb.control({ hour: 1, minute: 0 }),
      },
      {
        validators: Validators.required,
        asyncValidators: this.availabilityValidator.availableValidator(),
      }
    ),
  });

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private resService: ReservationService,
    private fb: FormBuilder,
    private availabilityValidator: TimeAvailabilityValidator,
    private _location: Location
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParams['mode'] === 'edit') {
      // Turn edit mode on
      this.editMode = true;

      // The resolver delivers the edited item (from the state or from the database)
      this.route.data
        .pipe(
          take(1),
          map((editedItem) => editedItem.res)
        )
        .subscribe((editedItem) => {
          // Redirect to the calendar if the user is not allowed to edit
          if (!editedItem) {
            this.router.navigate(['/calendar/view']);
          } else {
            // Load reservation data
            this.editedItem = { ...editedItem };

            // Calculate length in minutes
            const startTime = new Date(this.editedItem.startTime);
            const endTime = new Date(this.editedItem.endTime);
            const length =
              (endTime.getTime() - startTime.getTime()) / 1000 / 60;

            // Set values on the form with the preloaded data
            this.editForm.setValue({
              'reservation-name': this.editedItem.name,
              'reservation-full-date': {
                'reservation-date': {
                  year: startTime.getFullYear(),
                  month: startTime.getMonth() + 1,
                  day: startTime.getDate(),
                },
                'reservation-start-time': {
                  hour: startTime.getHours(),
                  minute: startTime.getMinutes(),
                },
                'reservation-length': {
                  hour: Math.floor(length / 60),
                  minute: length % 60,
                },
              },
            });
          }
        });
    }
  }

  onBackClicked() {
    this._location.back();
  }

  onSubmitForm() {
    // Store original start date, to later check if the week was changed
    const originalStart = this.editedItem.startTime;

    // Set edited values
    const date = this.editForm.get('reservation-full-date.reservation-date')
      .value;
    const start = this.editForm.get(
      'reservation-full-date.reservation-start-time'
    ).value;

    const length =
      this.editForm.get('reservation-full-date.reservation-length').value.hour *
        3600000 +
      this.editForm.get('reservation-full-date.reservation-length').value
        .minute *
        60000; // calculate length in miliseconds

    this.editedItem.name = this.editForm.value['reservation-name'];
    this.editedItem.startTime = new Date(
      +date.year,
      +date.month - 1,
      +date.day,
      +start.hour,
      +start.minute
    );
    this.editedItem.endTime = new Date(
      this.editedItem.startTime.getTime() + length
    );

    if (this.editMode) {
      // Save changes
      this.store.dispatch(
        new ReservationActions.SubmitEdit({
          reservation: this.editedItem,
          originalStartDate: originalStart,
        })
      );
    } else {
      // Create new reservation
      this.store.dispatch(
        new ReservationActions.NewReservation(this.editedItem)
      );
    }

    // Navigate to the week on which the reservation is
    this.store.dispatch(
      new ReservationActions.SetCurrWeekStart(
        this.resService.getFirstDayOfWeek(this.editedItem.startTime)
      )
    );
    this.router.navigate(['/calendar/view']);
  }

  onDeleteReservation() {
    console.log(this.editForm);
    // Navigate to the week on which the reservation is
    this.store.dispatch(
      new ReservationActions.SetCurrWeekStart(
        this.resService.getFirstDayOfWeek(this.editedItem.startTime)
      )
    );

    // Delete reservation
    this.store.dispatch(
      new ReservationActions.StartDeleteReservation(this.editedItem)
    );

    this.router.navigate(['/calendar/view']);
  }
}
