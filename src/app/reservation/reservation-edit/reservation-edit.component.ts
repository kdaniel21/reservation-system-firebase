import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../reservation.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as ReservationActions from '../store/reservation.actions';
import { ReservationService } from '../reservation.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TimeAvailabilityValidator } from './validator/availability.validator';
import { take } from 'rxjs/operators';
import { ReservationEditService } from './reservation-edit.service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css'],
})
export class ReservationEditComponent implements OnInit, OnDestroy {
  loading: boolean;
  editMode = false;
  editedItem: Reservation;
  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private resService: ReservationService,
    private fb: FormBuilder,
    private availabilityValidator: TimeAvailabilityValidator,
    private resEditService: ReservationEditService
  ) {}

  ngOnInit() {
    const mode = this.route.snapshot.queryParams.mode;
    if (mode === 'edit') this.editMode = true;

    this.route.data.subscribe((routeData) => {
      const res = routeData.res;
      console.log('RES: ', res);
      this.editedItem = new Reservation(
        res.id,
        res.createdBy,
        res.createdTime,
        res.name,
        res.startTime,
        res.endTime,
        res.place,
        res.deleted,
        res.recurringId
      );

      this.editForm = this.createForm();
    });
  }

  private createForm() {
    //Calculate length in minutes
    const length = new Date(
      this.editedItem.endTime.getTime() -
        this.editedItem.startTime.getTime() -
        1000 * 60 * 60
    ); // difference minus 1 hour (bc date starts from 1 hour);

    return this.fb.group({
      name: this.fb.control(this.editedItem.name, [Validators.required]),
      details: this.fb.group(
        {
          'full-date': this.fb.group({
            date: this.fb.control(this.editedItem.startTime),
            start: this.fb.control(
              this.resService.stringifyTime(this.editedItem.startTime)
            ),
            length: this.fb.control(
              { hours: length.getHours(), minutes: length.getMinutes() },
              Validators.required
            ),
          }),
          repeat: this.fb.control(!!this.editedItem.recurringId),
          place: this.fb.group({
            table: this.fb.control(this.editedItem.place.table),
            court: this.fb.control(this.editedItem.place.court),
          }),
        },
        {
          validators: Validators.required,
          asyncValidators: this.availabilityValidator.availableValidator(),
        }
      ),
    });
  }

  async onSubmitForm() {
    this.loading = true;

    const values = this.editForm.value;

    // Store original start date, to later check if the week was changed
    const originalStart = this.editedItem.startTime;

    // Set modified values
    const time = this.resEditService.parseTime(
      values.details['full-date'].start
    );
    const date = new Date(values.details['full-date'].date);
    date.setHours(time.hours, time.minutes, 0, 0);
    const length =
      this.resEditService.calculateLength(values.details['full-date'].length) *
      1000; // calculate length in miliseconds

    this.editedItem = {
      ...this.editedItem,
      name: values.name,
      startTime: date,
      endTime: new Date(date.getTime() + length),
      place: {
        table: values.details.place.table,
        court: values.details.place.court,
      },
    };

    // Navigate to the week which the reservation is on
    const firstDayOfWeek = this.resService.getFirstDayOfWeek(
      this.editedItem.startTime
    );
    this.store.dispatch(new ReservationActions.SetWeekStart(firstDayOfWeek));

    let isRecurring = !!this.editedItem.recurringId;

    let action;

    // if the reservation is recurring ask if the user wants to edit all
    if (isRecurring && this.editMode) {
      await this.resEditService.modifyAllRecurring().then((all) => {
        if (all)
          action = new ReservationActions.SubmitEditRecurring(this.editedItem);
        else isRecurring = false;
      });
    }

    // if the reservation is not recurring or the user does not want to edit all
    if (!isRecurring && this.editMode)
      action = new ReservationActions.SubmitEdit({
        reservation: this.editedItem,
        originalStartDate: originalStart,
      });

    // if new reservation is created
    if (!this.editMode && values.details.repeat)
      action = new ReservationActions.StartCreateRecurring(this.editedItem);
    else action = new ReservationActions.StartCreate(this.editedItem);

    this.store.dispatch(action);

    this.router.navigate(['/calendar/view']);
  }

  async onDeleteReservation() {
    this.editedItem.deleted = true;

    // Navigate to the week on which the reservation is
    const firstDayOfWeek = this.resService.getFirstDayOfWeek(
      this.editedItem.startTime
    );
    this.store.dispatch(new ReservationActions.SetWeekStart(firstDayOfWeek));

    let isRecurring = !!this.editedItem.recurringId;

    let action;

    if (isRecurring) {
      await this.resEditService.modifyAllRecurring().then((all) => {
        if (all)
          action = new ReservationActions.StartDeleteRecurring(this.editedItem);
        else isRecurring = false;
      });
    }

    if (!isRecurring)
      action = new ReservationActions.SubmitEdit({
        reservation: this.editedItem,
        originalStartDate: this.editedItem.startTime,
      });

    this.store.dispatch(action);

    this.router.navigate(['/calendar/view']);
  }

  ngOnDestroy() {
    this.store.dispatch(new ReservationActions.CancelEdit());
  }
}
