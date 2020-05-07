import { AuthInterceptor } from './auth/auth.interceptor';
import { NgModule } from '@angular/core';
import { REGION } from '@angular/fire/functions';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    { provide: REGION, useValue: 'europe-west3' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    AngularFireAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
