import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  template: `
    <h1 mat-dialog-title>Apply for every reservation?</h1>
    <div mat-dialog-content>
      Do you want to apply these changes on all the future reservations or only
      on this one?
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close="this">Only This</button>
      <button mat-raised-button color="warn" mat-dialog-close="every">
        Every
      </button>
    </div>
  `,
})
export class EditRecurringDialogComponent {
  constructor(public dialogRef: MatDialogRef<EditRecurringDialogComponent>) {}
}
