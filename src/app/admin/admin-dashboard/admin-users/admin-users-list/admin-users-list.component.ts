import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersInfoComponent } from '../admin-users-info/admin-users-info.component';
import { AdminUserEditComponent } from '../admin-user-edit/admin-user-edit.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { AdminUsersService } from '../admin-users.service';
import { map, switchMap } from 'rxjs/operators';
import { AdminUser } from './admin-user.model';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css'],
})
export class AdminUsersListComponent implements OnInit {
  users$: Observable<AdminUser[]>;
  alertMsg;
  loading;

  constructor(
    private afStore: AngularFirestore,
    private usersService: AdminUsersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.users$ = this.afStore
      .collection<AdminUser>('users', (ref) =>
        ref.where('deleted', '==', false)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const uid = a.payload.doc.id;
            console.log({ uid, ...data });
            return { uid, ...data };
          });
        })
      );
  }

  onOpenInfoModal(user: User) {
    const modalRef = this.modalService.open(AdminUsersInfoComponent);
    modalRef.componentInstance.user = user;
  }

  onOpenEditModal(user: User) {
    const modalRef = this.modalService.open(AdminUserEditComponent);
    modalRef.componentInstance.user = user;
  }

  // Disable user
  onDisableUser(user: User) {
    // Confirmation modal
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.title = `Confirm ${
      !user.disabled ? 'disablement' : 'enablement'
    }`;
    modalRef.componentInstance.message = `Are you sure you want to ${
      !user.disabled ? 'disable' : 'enable'
    } ${user.name}?`;
    modalRef.componentInstance.submitBtnText = user.disabled
      ? 'Enable'
      : 'Disable';

    // Wait for confirmation
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.loading = true;

        this.usersService
          .disableUser(user)
          .then(() => {
            this.alertMsg = {
              color: 'alert-success',
              message: `${user.name} was ${
                !user.disabled ? 'disabled' : 'enabled'
              } successfully!`,
            };
          })
          .catch(() => {
            this.alertMsg = {
              color: 'alert-danger',
              message: `Error! ${user.name} couldn't be ${
                user.disabled ? 'disabled' : 'enabled'
              }! Please try again!`,
            };
          })
          .finally(() => {
            this.loading = false;
            setTimeout(() => (this.alertMsg = null), 5000);
          });
      }
    });
  }

  onDeleteUser(user: User) {
    // Confirmation modal
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.title = 'Confirm delete';
    modalRef.componentInstance.message = `Are you sure you want to delete ${user.name}? This action is permament and cannot be redone later!`;
    modalRef.componentInstance.submitBtnText = 'Delete';

    // Wait for confirmation
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.loading = true;

        this.usersService
          .deleteUser(user)
          .then(() => {
            this.alertMsg = {
              color: 'alert-success',
              message: `${user.name} was deleted successfully!`,
            };
          })
          .catch(() => {
            this.alertMsg = {
              color: 'alert-danger',
              message: `Error! ${user.name} couldn't be deleted! Please try again!`,
            };
          })
          .finally(() => {
            this.loading = false;
            setTimeout(() => (this.alertMsg = null), 5000);
          });
      }
    });
  }
}
