import { NgModule } from "@angular/core";
import { REGION } from '@angular/fire/functions';

@NgModule({
  providers: [
    { provide: REGION, useValue: 'europe-west3'}
  ]
})
export class CoreModule {}
