import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthRegisterUserComponent } from './register-user/auth-register-user.component';
import { AuthForgottenPasswordComponent } from './forgotten-password/auth-forgotten-password.component';

const routes: Routes = [
  // Routes
  { path: '', redirectTo: 'login', pathMatch: 'full', },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthRegisterUserComponent },
  { path: 'reset-password', component: AuthForgottenPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
