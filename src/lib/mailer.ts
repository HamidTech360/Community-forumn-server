import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SEC,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.MAIL_REF,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    //@ts-ignore
    service: "gmail",
    auth: {
      serviceClient: "gmail",
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SEC,
      refreshToken: process.env.MAIL_REF,
    },
  });

  return transporter;
};

export const sendMail: (
  email: string,
  message: string,
  subject: string
) => Promise<void> = async (email, message, subject) => {
  try {
    let transport = await createTransporter();
    transport.sendMail({
      from: process.env.MAILER,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    console.log(error);
  }
};
