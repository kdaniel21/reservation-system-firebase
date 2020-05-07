import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private afAuth: AngularFireAuth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.afAuth.idToken.pipe(
      take(1),
      switchMap((idToken) => {
        if (!idToken || idToken == null) {
          return next.handle(req);
        }

        const newReq = req.clone({
          params: new HttpParams().set('auth', idToken),
        });
        return next.handle(newReq);
      })
    );
  }
}
