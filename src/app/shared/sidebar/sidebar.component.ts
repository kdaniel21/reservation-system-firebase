import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  screenWidth: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Get screen width to check if mobile or not
    this.screenWidth = window.innerWidth;
    window.onresize = () => (this.screenWidth = window.innerWidth);
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
