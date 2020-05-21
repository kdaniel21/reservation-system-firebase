import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AdminUsersInfoComponent } from '../admin-users-info/admin-users-info.component';
import { AdminUsersService } from '../admin-users.service';
import { take } from 'rxjs/operators';
import { StoredUser } from './admin-user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AdminUserEditComponent } from '../admin-user-edit/admin-user-edit.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminUserInviteComponent } from '../admin-user-invite/admin-user-invite.component';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css'],
})
export class AdminUsersListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'admin',
    'disabled',
    'uid',
    'actions',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<StoredUser>;

  loading: boolean;

  constructor(
    private usersService: AdminUsersService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    // Get users from db
    this.usersService.getUsers().subscribe((userData) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(userData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onOpenInfoModal(user: User) {
    this.bottomSheet.open(AdminUsersInfoComponent, {
      data: { user },
    });
  }

  onOpenEditModal(user: User) {
    this.dialog.open(AdminUserEditComponent, {
      maxWidth: '22rem',
      maxHeight: '19rem',
      height: '100%',
      width: '100%',
      data: { user },
    });
  }

  onInviteUser() {
    this.dialog.open(AdminUserInviteComponent, {
      maxWidth: '20rem',
      maxHeight: '17rem',
      height: '100%',
      width: '100%',
    });
  }

  // // Disable user
  onDisableUser(user: User) {
    // Confirmation Modal
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: `${!user.disabled ? 'Disable' : 'Enable'} User`,
        message: `Are you sure you want to ${
          !user.disabled ? 'disable' : 'enable'
        } ${user.name}?`,
        submitBtnText: user.disabled ? 'Enable' : 'Disable',
      },
    });

    // Wait for confirmation
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === 'confirm') {
          this.loading = true;

          this.usersService
            .disableUser(user)
            .then(() => {
              this.snackBar.open(
                `${user.name} was ${
                  !user.disabled ? 'disabled' : 'enabled'
                } successfully!`
              );
            })
            .catch(() => {
              this.snackBar.open(
                `Error! ${user.name} couldn't be ${
                  user.disabled ? 'disabled' : 'enabled'
                }! Please try again!`
              );
            })
            .finally(() => (this.loading = false));
        }
      });
  }

  onDeleteUser(user: User) {
    // Confirmation Modal
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: `Delete User`,
        message: `Are you sure you want to delete ${user.name}? This action is permament and cannot be redone later!`,
        submitBtnText: 'Delete',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === 'confirm') {
          this.loading = true;
          this.usersService
            .deleteUser(user)
            .then(() => {
              this.snackBar.open(`${user.name} was deleted successfully!`);
            })
            .catch(() => {
              this.snackBar.open(
                `Error! ${user.name} couldn't be deleted! Please try again!`
              );
            })
            .finally(() => (this.loading = false));
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
