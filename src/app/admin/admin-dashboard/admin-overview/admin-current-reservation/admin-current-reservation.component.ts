import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/reservation/reservation.model';
import { AdminCurrentReservationService } from './admin-current-reservation.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-current-reservation',
  templateUrl: './admin-current-reservation.component.html',
})
export class AdminCurrentReservationComponent implements OnInit {
  currentReservation;
  currResSub: Subscription;

  constructor(
    private currResService: AdminCurrentReservationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.currResSub = this.currResService
      .getCurrentReservation()
      .subscribe((currRes) => {
        if (currRes) {
          this.currentReservation = {
            name: currRes.name,
            start: new Date(currRes.startTime)
              .toLocaleTimeString('hu-HU')
              .slice(0, -3),
            end: new Date(currRes.endTime)
              .toLocaleTimeString('hu-HU')
              .slice(0, -3),
            createdBy: currRes.createdBy,
          };

          this.authService
            .getDisplayName(this.currentReservation.createdBy)
            .pipe(take(1))
            .subscribe((name) => (this.currentReservation.createdBy = name));
        }
      });
  }

  ngOnDestroy() {
    this.currResSub.unsubscribe();
  }
}
