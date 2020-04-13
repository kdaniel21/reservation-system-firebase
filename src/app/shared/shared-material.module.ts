import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

const material = [
   MatSidenavModule,
   MatButtonModule,
   MatIconModule,
   MatToolbarModule,
   MatListModule
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class SharedMaterialModule {}
