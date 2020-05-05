import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { ContactService } from '../contact.service';

@Injectable({ providedIn: 'root' })
export class ContactViewResolver implements Resolve<Observable<any>> {
  constructor(
    private store: Store<AppState>,
    private contactService: ContactService
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
          return of({ ...adminState.viewedMessage });
        }

        return this.contactService.getContact(id);
      })
    );
  }
}
