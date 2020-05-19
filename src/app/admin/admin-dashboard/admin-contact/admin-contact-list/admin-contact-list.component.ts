import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactMetaData } from './../contact.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AdminContactService } from '../admin-contact.service';
import { AppState } from 'src/app/store/app.reducer';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-admin-contact-list',
  templateUrl: './admin-contact-list.component.html',
  styleUrls: ['./admin-contact-list.component.css'],
})
export class AdminContactListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'topic',
    'name',
    'email',
    'priority',
    'closed',
    'date',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<ContactMetaData>;

  loading: boolean;
  contactsSub: Subscription;

  constructor(
    private contactService: AdminContactService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loading = true;
    this.contactsSub = this.contactService.getContacts().subscribe((contacts) => {
      this.loading = false;

      this.dataSource = new MatTableDataSource(contacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openMessage(contact) {
    this.store.dispatch(new AdminActions.StartViewMessage(contact));
    this.router.navigate(['/contact/view', contact.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.contactsSub.unsubscribe();
  }
}
