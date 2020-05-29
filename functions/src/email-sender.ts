import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

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
