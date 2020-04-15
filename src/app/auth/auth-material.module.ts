import { NgModule } from '@angular/core';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const material = [
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class AuthMaterialModule {}
