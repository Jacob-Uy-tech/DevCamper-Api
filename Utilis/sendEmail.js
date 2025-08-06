const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const sendMail = async function (option) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });

  // Wrap in an async IIFE so we can use await.
  const mailOption = {
    from: `${process.env.FROM_NAME} <talk2uyjacob@gmail.com>`,
    to: option.email,
    subject: option.subject,
    text: option.message, // plain‑text body
  };

  await transporter.sendMail(mailOption);
};

module.exports = sendMail;
