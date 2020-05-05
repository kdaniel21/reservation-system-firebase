import { Subscription } from 'rxjs';
import { ContactService } from './../contact.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-contact-history',
  templateUrl: './contact-history.component.html',
})
export class ContactHistoryComponent implements OnInit, OnDestroy {
  contactsSub: Subscription;
  contacts;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ContactHistoryComponent>,
    public contactService: ContactService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  ngOnInit() {
    // Get contacts of the user
    this.contactsSub = this.contactService
      .getContactHistory(this.data.id)
      .subscribe((contacts) => (this.contacts = contacts));
  }

  ngOnDestroy() {
    this.contactsSub.unsubscribe();
  }
}
