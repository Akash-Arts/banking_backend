// const nodemailer = require("nodemailer");

// module.exports = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "akashdtk84@gmail.com",
//     pass: "Akash@12345"
//   }
// });

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;
