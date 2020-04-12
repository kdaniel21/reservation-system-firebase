import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  //styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{

  constructor(private store: Store<AppState>) { }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
