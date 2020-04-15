import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  screenWidth: number;
  currentUser: User;
  currentUserSub: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // Get screen width to check if mobile or not
    this.screenWidth = window.innerWidth;
    window.onresize = () => (this.screenWidth = window.innerWidth);

    // Get current user
    this.currentUserSub = this.store.select('auth').subscribe((authState) => {
      this.currentUser = authState.user;
    });
  }

  onLogout() {
    this.afAuth.signOut();
    this.store.dispatch(new AuthActions.Logout());
  }
}
