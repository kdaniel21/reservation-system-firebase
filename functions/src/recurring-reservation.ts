import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  formatDateToString,
  getFirstDayOfWeek,
} from './helperFunctions/date-functions';

export const createRecurringReservation = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    if (!context.auth?.uid) return { error: 'No access!' };

    // Convert into date & create unique ID
    const reservation = {
      ...data.reservation,
      startTime: new Date(data.reservation.startTime),
      endTime: new Date(data.reservation.endTime),
      createdTime: new Date(data.reservation.createdTime).toISOString(),
      recurringId: admin.database().ref().push().key,
      createdBy: context.auth.uid,
    };

    const year = reservation.startTime.getFullYear();
    // Generate only for the current year
    while (
      reservation.startTime.getFullYear() ===
      new Date(data.reservation.startTime).getFullYear()
    ) {
      const date = reservation.startTime;
      const formattedStartOfWeek = formatDateToString(getFirstDayOfWeek(date));

      // Create in the DB
      admin
        .database()
        .ref(`/calendar/${year}/${formattedStartOfWeek}/`)
        .push({
          ...reservation,
          startTime: reservation.startTime.toISOString(),
          endTime: reservation.endTime.toISOString(),
        });

      // Add 1 week to the date
      reservation.startTime = new Date(
        reservation.startTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      reservation.endTime = new Date(
        reservation.endTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    }

    return data.reservation;
  });

export const saveAllRecurringChanges = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    if (!context.auth?.uid) return { error: 'No access!' };

    const reservation = {
      ...data.reservation,
      startTime: new Date(data.reservation.startTime),
      endTime: new Date(data.reservation.endTime),
      createdTime: new Date(data.reservation.createdTime).toISOString(),
      createdBy: context.auth.uid,
    };
    const recurringId = reservation.recurringId;

    const year = reservation.startTime.getFullYear();
    // Look up only within the current year
    while (
      reservation.startTime.getFullYear() ===
      new Date(data.reservation.startTime).getFullYear()
    ) {
      const date = reservation.startTime;
      const formattedStartOfWeek = formatDateToString(getFirstDayOfWeek(date));

      // Modify in the DB
      const query = admin
        .database()
        .ref(`/calendar/${year}/${formattedStartOfWeek}/`)
        .orderByChild('recurringId')
        .equalTo(recurringId);

      await query
        .once('value')
        .then((snapshot) => {
          const key = Object.keys(snapshot.val())[0];
          if (!snapshot.exists() || snapshot.val().key.recurringId !== recurringId) {
            return null;
          }

          return snapshot.child(key).ref.update({ ...reservation });
        })
        .catch((err) => console.log('ERROR: ', err));

      // Update the date with +1 week
      reservation.startTime = new Date(
        reservation.startTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      reservation.endTime = new Date(
        reservation.endTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    }

    return;
  });

export const deleteRecurringReservation = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    if (!context.auth?.uid) return { error: 'No access!' };

    const recurringId = data.reservation.recurringId;
    const startDate = new Date(data.reservation.startTime);

    const year = startDate.getFullYear();
    while (
      startDate.getFullYear() ===
      new Date(data.reservation.startTime).getFullYear()
    ) {
      const formattedStartOfWeek = formatDateToString(
        getFirstDayOfWeek(startDate)
      );

      const ref = admin
        .database()
        .ref(`/calendar/${year}/${formattedStartOfWeek}/`)
        .orderByChild('recurringId')
        .equalTo(recurringId);

      await ref.once('child_added').then((snapshot) => {
        if (!snapshot.exists()) return;
        return snapshot.ref.remove();
      });

      startDate.setDate(startDate.getDate() + 7);
    }

    return;
  });
