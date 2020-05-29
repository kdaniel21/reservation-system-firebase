import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
