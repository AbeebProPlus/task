const nodemailer = require("nodemailer");
const transporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

module.exports = transporter;
