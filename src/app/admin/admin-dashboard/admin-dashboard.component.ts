import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  ngOnInit() {
    console.log('INITIALIZED');
  }

  constructor(public changeRef: ChangeDetectorRef) {}

}
