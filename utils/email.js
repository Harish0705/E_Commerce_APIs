import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PWD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: '"Mable Armstrong" <mable81@ethereal.email>',
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async ({
  name,
  email,
  emailVerificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${emailVerificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${name}</h4>
      ${message}
      `,
  });
};

export const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
   ${message}
   `,
  });
};
