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
// Expected value: { uid: user's uid, updateObj: {updated parameters}}
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
        return { message: `${data.email} user successfully created!`, user: userRecord };
      })
      .catch((error) => {
        return { error: `Error creating new user: ${error}` };
      });
  });

// Sending invitation emails
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
      return { error: 'Something bad happened: ', err };
    }
  });
