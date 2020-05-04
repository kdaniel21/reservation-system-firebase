import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { UserMessage } from './../message.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, OnInit } from '@angular/core';
import { AdminContactService } from '../admin-contact.service';
import { AppState } from 'src/app/store/app.reducer';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-admin-contact-list',
  templateUrl: './admin-contact-list.component.html',
  styleUrls: ['./admin-contact-list.component.css'],
})
export class AdminContactListComponent implements OnInit {
  displayedColumns: string[] = [
    'topic',
    'name',
    'email',
    'priority',
    'solved',
    'date',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<UserMessage>;

  loading: boolean;

  constructor(
    private contactService: AdminContactService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loading = true;
    this.contactService.getMessages().subscribe((messages) => {
      this.loading = false;
      console.log(messages);
      this.dataSource = new MatTableDataSource(messages);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openMessage(message) {
    this.store.dispatch(new AdminActions.StartViewMessage(message));
    this.router.navigate(['../view', message.id], {relativeTo: this.route});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
