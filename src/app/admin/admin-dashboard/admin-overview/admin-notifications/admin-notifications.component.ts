import { Component } from '@angular/core';

interface Notification {
  id: number;
  text: string;
  priority: boolean;
  action: string;
}

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
})
export class AdminNotificationsComponent {
  notifications: Notification[] = [];
}
