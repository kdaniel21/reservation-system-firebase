import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const material = [
  MatDividerModule,
  MatCardModule,
  MatListModule,
  MatChipsModule,
  ScrollingModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  NgxMaterialTimepickerModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatBottomSheetModule,
  MatDialogModule
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class ReservationMaterialModule {}
