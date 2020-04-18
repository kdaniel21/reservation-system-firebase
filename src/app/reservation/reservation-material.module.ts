import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';

const material = [
  MatGridListModule,
  MatDividerModule,
  MatCardModule,
  MatListModule,
  MatChipsModule,
  ScrollingModule
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class ReservationMaterialModule {}
