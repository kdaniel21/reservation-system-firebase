import { EditRecurringDialogComponent } from './edit-recurring-dialog/edit-recurring-dialog.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../reservation.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as ReservationActions from '../store/reservation.actions';
import { ReservationService } from '../reservation.service';
import { Validators, FormBuilder } from '@angular/forms';
import { TimeAvailabilityValidator } from './validator/availability.validator';
import { take, map } from 'rxjs/operators';
import { ReservationEditService } from './reservation-edit.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css'],
})
export class ReservationEditComponent implements OnInit, OnDestroy {
  loading: boolean;
  // Setting default values
  editMode = false;
  editedItem = new Reservation('', '', new Date(), '', new Date(), new Date(), {
    table: false,
    court: false,
  });

  currTime = new Date();
  defaultTime = new Date(
    this.currTime.getFullYear(),
    this.currTime.getMonth(),
    this.currTime.getDate(),
    this.currTime.getHours() + 1,
    0,
    0
  );

  // Create the reactive form
  editForm = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    details: this.fb.group(
      {
        'full-date': this.fb.group({
          date: this.fb.control(this.defaultTime),
          start: this.fb.control(
            this.resService.stringifyTime(this.defaultTime)
          ),
          length: this.fb.control(
            { hours: '01', minutes: '00' },
            Validators.required
          ),
        }),
        repeat: this.fb.control(false),
        place: this.fb.group({
          table: this.fb.control(false),
          court: this.fb.control(false),
        }),
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
    private resEditService: ReservationEditService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParams.mode === 'new')
      this.store
        .select('auth')
        .pipe(take(1))
        .subscribe((authState) =>
          this.editForm.patchValue({ name: `${authState.user.name} - ` })
        );

    if (this.route.snapshot.queryParams.mode !== 'edit') return;

    // Turn edit mode on
    this.editMode = true;

    // The resolver delivers the edited item (from the state or from the database)
    this.loading = true;
    this.route.data
      .pipe(
        take(1),
        map((editedItem) => editedItem.res)
      )
      .subscribe((editedItem) => {
        console.log(editedItem);
        this.loading = false;

        // Load reservation data
        this.editedItem = { ...editedItem };

        // Calculate length in minutes
        const startTime = new Date(this.editedItem.startTime);
        const endTime = new Date(this.editedItem.endTime);
        const length = new Date(
          endTime.getTime() - startTime.getTime() - 1000 * 60 * 60
        ); // difference minus 1 hour (date starts from 1 hour);

        // Set values on the form with the preloaded data
        this.editForm.patchValue({
          name: this.editedItem.name,
          details: {
            'full-date': {
              date: startTime,
              start: this.resService.stringifyTime(this.editedItem.startTime),
              length: {
                hours: length.getHours(),
                minutes: length.getMinutes(),
              },
            },
            place: {
              table: this.editedItem.place.table,
              court: this.editedItem.place.court,
            },
          },
        });
      });
  }

  onSubmitForm() {
    this.loading = true;
    // Navigate to the week on which the reservation is
    this.store.dispatch(
      new ReservationActions.SetWeekStart(
        this.resService.getFirstDayOfWeek(this.editedItem.startTime)
      )
    );

    // Store original start date, to later check if the week was changed
    const originalStart = this.editedItem.startTime;

    // Set edited values
    const date = this.editForm.get('details.full-date.date').value;
    const start = this.resEditService.parseTime(
      this.editForm.get('details.full-date.start').value
    );

    const lengthValue = this.editForm.get('details.full-date.length').value;
    const length = lengthValue.hours * 3600000 + lengthValue.minutes * 60000; // calculate length in miliseconds

    this.editedItem.name = this.editForm.value['name'];

    this.editedItem.startTime = new Date(date);
    this.editedItem.startTime.setHours(start.hours);
    this.editedItem.startTime.setMinutes(start.minutes);
    this.editedItem.startTime.setSeconds(0);

    this.editedItem.endTime = new Date(
      this.editedItem.startTime.getTime() + length
    );

    this.editedItem.place = {
      table: this.editForm.get('details.place.table').value,
      court: this.editForm.get('details.place.court').value,
    };

    if (this.editedItem.recurringId) {
      this.modifyAllRecurring().subscribe((recurring) => {
        if (recurring)
          this.store.dispatch(
            new ReservationActions.SubmitEditRecurring(this.editedItem)
          );
        else
          this.store.dispatch(
            new ReservationActions.SubmitEdit({
              reservation: this.editedItem,
              originalStartDate: originalStart,
            })
          );
      });
    } else if (this.editMode)
      this.store.dispatch(
        new ReservationActions.SubmitEdit({
          reservation: this.editedItem,
          originalStartDate: originalStart,
        })
      );
    else if (this.editForm.get('details.repeat').value)
      this.store.dispatch(
        new ReservationActions.StartCreateRecurring(this.editedItem)
      );
    else
      this.store.dispatch(new ReservationActions.StartCreate(this.editedItem));

    this.router.navigate(['/calendar/view']);
  }

  onDeleteReservation() {
    this.editedItem.deleted = true;

    // Navigate to the week on which the reservation is
    this.store.dispatch(
      new ReservationActions.SetWeekStart(
        this.resService.getFirstDayOfWeek(this.editedItem.startTime)
      )
    );

    if (this.editedItem.recurringId) {
      this.modifyAllRecurring().subscribe((all) => {
        if (all)
          this.store.dispatch(
            new ReservationActions.StartDeleteRecurring(this.editedItem)
          );
        else
          this.store.dispatch(
            new ReservationActions.SubmitEdit({
              reservation: this.editedItem,
              originalStartDate: this.editedItem.startTime,
            })
          );
      });
    } else
      this.store.dispatch(
        new ReservationActions.SubmitEdit({
          reservation: this.editedItem,
          originalStartDate: this.editedItem.startTime,
        })
      );

    this.router.navigate(['/calendar/view']);
  }

  private modifyAllRecurring() {
    const ref = this.dialog.open(EditRecurringDialogComponent);

    return ref.afterClosed().pipe(
      take(1),
      map((result) => (result === 'every' ? true : false))
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ReservationActions.CancelEdit());
  }
}
