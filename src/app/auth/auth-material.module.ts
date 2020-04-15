import { NgModule } from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const material = [
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatSnackBarModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class AuthMaterialModule {}
