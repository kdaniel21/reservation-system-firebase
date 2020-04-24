import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';


const material = [
   MatSidenavModule,
   MatButtonModule,
   MatIconModule,
   MatToolbarModule,
   MatListModule,
   MatProgressSpinnerModule,
   MatDialogModule
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class SharedMaterialModule {}
