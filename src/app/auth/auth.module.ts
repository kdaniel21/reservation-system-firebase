import { NgModule } from "@angular/core";
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { AuthRegisterUserComponent } from './register-user/auth-register-user.component';
import { SharedModule } from '../shared/shared.module';
import { InfoModalComponent } from '../shared/info-modal/info-modal.component';
import { AuthForgottenPasswordComponent } from './forgotten-password/auth-forgotten-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    AuthRegisterUserComponent,
    AuthForgottenPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [],
  entryComponents: [InfoModalComponent]
})
export class AuthModule {}
