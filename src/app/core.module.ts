import { NgModule } from '@angular/core';
import { REGION } from '@angular/fire/functions';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  providers: [
    { provide: REGION, useValue: 'europe-west3' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class CoreModule {}
