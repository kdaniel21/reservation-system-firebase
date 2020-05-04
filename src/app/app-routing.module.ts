import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, customClaims } from '@angular/fire/auth-guard/';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

const adminOnly = () =>
  pipe(
    customClaims,
    map((claims) => (claims.admin === true ? true : ['auth', 'login']))
  );
const redirectUnauthorizedToLogin = () =>
  map((user) => (!user ? ['auth', 'login'] : true));
const redirectLoggedInToCalendar = () =>
  map((user) => (!!user ? ['calendar', 'view'] : true));

const appRoutes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToCalendar },
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./reservation/reservation.module').then(
        (m) => m.ReservationModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./contact/contact.module').then((m) => m.ContactModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
