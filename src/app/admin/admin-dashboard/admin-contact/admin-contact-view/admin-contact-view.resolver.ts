import { AdminContactService } from './../admin-contact.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserMessage } from './../message.model';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminContactViewResolver implements Resolve<Observable<any>> {
  constructor(
    private store: Store<AppState>,
    private contactService: AdminContactService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.params['id'];
    if (!id) return null;

    return this.store.select('admin').pipe(
      take(1),
      switchMap((adminState) => {
        if (adminState.viewedMessage !== null) {
          return of(adminState.viewedMessage);
        } else {
          return this.contactService.getMessage(id);
        }
      })
    );
    return of(null);
  }
}
