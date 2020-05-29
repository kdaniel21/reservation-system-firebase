import { onNewReservation, onReservationEdited } from './db-events';
export { onNewReservation, onReservationEdited };

import { sendInvitationEmail, sendEmail } from './email-sender';
export { sendInvitationEmail, sendEmail };

import {
  createRecurringReservation,
  saveAllRecurringChanges,
  deleteRecurringReservation,
} from './recurring-reservation';
export {
  createRecurringReservation,
  saveAllRecurringChanges,
  deleteRecurringReservation,
};

import {
  manageAdminAccess,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from './user-actions';
export { manageAdminAccess, getAllUsers, updateUser, deleteUser, createUser };

import * as admin from 'firebase-admin';

admin.initializeApp();
