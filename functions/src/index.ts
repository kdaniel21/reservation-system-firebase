import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Give/revoke admin access
export const manageAdminAccess = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    // Only admins can add other admins
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    return admin
      .auth()
      .getUserByEmail(data.email)
      .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
          admin: data.admin,
        });
      })
      .then(() => {
        if (data.admin) {
          return {
            message: `Success! ${data.email} has been made an admin!`,
          };
        } else {
          return {
            message: `Success! ${data.email} is no longer an admin!`,
          };
        }
      })
      .catch(() => {
        return { error: `Admin access couldn't be changed!` };
      });
  });

// Get all users
export const getAllUsers = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    // Only admins have access
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    return admin
      .auth()
      .listUsers(1000)
      .then((listUserResult) => {
        return listUserResult.users;
      })
      .catch((err) => {
        return { error: 'Error!' + err };
      });
  });

// Update a user
// Expected parameter: { uid: user's uid, updateObj: {updated parameters}}
export const updateUser = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    return admin
      .auth()
      .updateUser(data.uid, data.updateObj)
      .then((userRecord) => {
        return { message: 'Successfully updated!' };
      })
      .catch((err) => {
        return { error: 'Error!' + err };
      });
  });

// Delete user
export const deleteUser = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    return admin
      .auth()
      .deleteUser(data.uid)
      .then(() => {
        return { message: 'Successfully updated' };
      })
      .catch((err) => {
        return { error: `Error deleting user: ${err}` };
      });
  });

// Create user with email and password
export const createUser = functions
  .region('europe-west3')
  .https.onCall((data, context) => {
    return admin
      .auth()
      .createUser({
        email: data.email,
        password: data.password,
      })
      .then((userRecord) => {
        return {
          message: `${data.email} user successfully created!`,
          user: userRecord,
        };
      })
      .catch((error) => {
        return { error: `Error creating new user: ${error}` };
      });
  });

// Send invitation emails
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

export const sendInvitationEmail = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    // Email message
    const mailOptions = {
      from: '"Reservation System Corp." <noreply@reservationsystem.com>',
      to: data.email,
      subject: 'Invitation to the invitation system',
      html: `<h5>Dear ${data.name}!</h5><br><p>Looks like somebody has invited you to register to the reservation system.</p><a href="http://localhost:4200/auth/register?id=${data.id}">Click here to register</a>`,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      return {
        message: `Invitation letter successfuly sent to ${data.email}!`,
      };
    } catch (err) {
      return { error: 'Something went wrong: ', err };
    }
  });

// Send email back to contact request/message
export const sendEmail = functions
  .region('europe-west3')
  .https.onCall(async (data, context) => {
    if (context.auth?.token.admin !== true) {
      return { error: 'No access!' };
    }

    // Email message
    const mailOptions = {
      from: '"Reservation System" <noreply@reservationsystem.com>',
      to: data.email,
      subject: `${data.topic}`,
      html: `<h5>Dear ${data.name}!</h5><br><p>${data.message}</p>`,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      return {
        message: `Messsage successfuly sent to ${data.email}!`,
      };
    } catch (err) {
      return { error: 'Something went wrong: ', err };
    }
  });

const formatDateToString = (date: Date) => {
  const year = date.getFullYear();
  // pasting a 0 before the number if single digit
  const month =
    date.getMonth() + 1 < 10
      ? 0 + String(date.getMonth() + 1)
      : date.getMonth() + 1;
  const day =
    date.getDate() < 10 ? 0 + date.getDate().toString() : date.getDate();

  return year + '-' + month + '-' + day;
};

const getFirstDayOfWeek = (userDate: Date) => {
  const date = new Date(userDate);
  const diff = date.getDate() - date.getDay() + (date.getDay() == 0 ? -6 : 1);
  date.setHours(0, 0, 0, 0);

  return new Date(date.setDate(diff));
};

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

      // Create in the DB
      const query = admin
        .database()
        .ref(`/calendar/${year}/${formattedStartOfWeek}/`)
        .orderByChild('recurringId')
        .equalTo(recurringId);

      await query.once('child_added').then((snapshot) =>
        void snapshot.ref.update({ ...reservation }));

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

      await ref
        .once('child_added')
        .then((snapshot) => void snapshot.ref.remove());

      startDate.setDate(startDate.getDate() + 7);
    }

    return;
  });
