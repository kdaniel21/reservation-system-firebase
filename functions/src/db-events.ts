import { formatDateToString } from './helperFunctions/date-functions';
import { Reservation, ReservedPlace } from './reservation.model';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

function convertTimeToString(time: Date) {
  const hours = time.getHours();
  const mins = time.getMinutes();
  const minutes = mins < 10 ? '0' + mins : mins;

  return hours + ':' + minutes;
}

function convertToPlaceReservation(reservation: Reservation) {
  if (reservation.deleted) return {};

  const result: ReservedPlace = {};
  const id = reservation.id;

  const start = new Date(reservation.startTime);

  while (start.getTime() < reservation.endTime.getTime()) {
    const stringDate = convertTimeToString(start);

    result[stringDate] = id;

    start.setMinutes(start.getMinutes() + 5);
  }

  return result;
}

function hasTimeIntersection(
  placeReservation1: ReservedPlace,
  placeReservation2: ReservedPlace
): boolean {
  if (!placeReservation1 || !placeReservation2) return false;
  const res1 = Object.keys(placeReservation1);
  const res2 = Object.keys(placeReservation2);

  if (res1.length === 0 || res2.length === 0) return false;

  for (const time of res1)
    if (
      res2.indexOf(time) !== -1 &&
      placeReservation2[time] !== placeReservation1[time]
    )
      return true;

  return false;
}

async function isPlaceAvailable(reservation: Reservation, place: string) {
  const date = formatDateToString(reservation.startTime);
  const placeReservation = convertToPlaceReservation(reservation);

  const ref = admin.database().ref(`/reserved/${place}/${date}/`);
  const snapshot = await ref.once('value');

  if (hasTimeIntersection(snapshot.val(), placeReservation)) return false;
  else return true;
}

async function isReservationAvailable(reservation: Reservation) {
  const usedPlaces = getUsedPlaces(reservation.place);

  for (const place of usedPlaces)
    if ((await isPlaceAvailable(reservation, place)) === false) return false;

  return true;
}

function getUsedPlaces(places: { [placeName: string]: boolean }) {
  return Object.keys(places).filter((key) => places[key]);
}

// Reserves place for the reservation
// Rewrites every reservation with the same ID
function reservePlace(reservation: Reservation) {
  const placeReservation = convertToPlaceReservation(reservation);
  const usedPlaces = getUsedPlaces(reservation.place);
  const date = formatDateToString(reservation.startTime);

  const writes = [];
  for (const place of usedPlaces) {
    writes.push(
      admin
        .database()
        .ref(`/reserved/${place}/${date}/`)
        .once('value')
        .then((snapshot) => {
          const updatedObject: ReservedPlace = { ...placeReservation };

          if (Object.keys(snapshot.val()))
            // Filter out every old timestamp related to the reservation
            for (const key of Object.keys(snapshot.val()))
              if (snapshot.val()[key] !== reservation.id)
                updatedObject[key] = snapshot.val()[key];

          return admin
            .database()
            .ref(`/reserved/${place}/${date}`)
            .set({ ...updatedObject });
        })
    );
  }

  return Promise.all(writes);
}

function removePlaceReservation(reservation: Reservation) {
  const usedPlaces = getUsedPlaces(reservation.place);
  const date = formatDateToString(reservation.startTime);
  const id = reservation.id;

  const deletes = [];
  for (const place of usedPlaces) {
    deletes.push(
      admin
        .database()
        .ref(`/reserved/${place}/${date}`)
        .once('value')
        .then((snapshot) => {
          const updatedObject: ReservedPlace = {};
          for (const key of Object.keys(snapshot.val()))
            if (snapshot.val()[key] !== id)
              updatedObject[key] = snapshot.val()[key];

          return admin
            .database()
            .ref(`/reserved/${place}/${date}`)
            .set({ ...updatedObject });
        })
    );
  }

  return Promise.all(deletes);
}

function isTimeOrPlaceModified(
  newReservation: Reservation,
  oldReservation: Reservation
) {
  const newRes = Object.keys(
    convertToPlaceReservation(newReservation)
  ).toString();
  const oldRes = Object.keys(
    convertToPlaceReservation(oldReservation)
  ).toString();

  const newPlace = JSON.stringify(newReservation.place);
  const oldPlace = JSON.stringify(oldReservation.place);

  return newRes !== oldRes || newPlace !== oldPlace;
}

function convertSnapshotToReservation(
  snapshot: functions.database.DataSnapshot
): Reservation {
  return {
    ...snapshot.val(),
    id: snapshot.key,
    startTime: new Date(snapshot.val().startTime),
    endTime: new Date(snapshot.val().endTime),
    createdTime: new Date(snapshot.val().createdTime),
  };
}

export const onNewReservation = functions
  .region('europe-west3')
  .database.ref('/calendar/{year}/{week}/{reservationId}')
  .onCreate(async (snapshot, context) => {
    const newReservation = convertSnapshotToReservation(snapshot);

    // Remove reservation if time (and place) is already reserved
    const available = await isReservationAvailable(newReservation);
    if (!available) return snapshot.ref.remove();

    return reservePlace(newReservation);
  });

export const onReservationEdited = functions
  .region('europe-west3')
  .database.ref('/calendar/{year}/{week}/{reservationId}')
  .onUpdate(async (snapshot, context) => {
    if (snapshot.after === snapshot.before) return;

    const reservation = convertSnapshotToReservation(snapshot.after);

    // Removes place reservation if reservation got deleted
    if (reservation.deleted) return removePlaceReservation(reservation);

    const available = await isReservationAvailable(reservation);
    // Undo changes if new time is not available
    if (!available) return snapshot.after.ref.set(snapshot.before.val());

    const oldReservation = convertSnapshotToReservation(snapshot.before);
    // Re-reserves place only if changed
    if (isTimeOrPlaceModified(reservation, oldReservation))
      return reservePlace(reservation);

    return;
  });
