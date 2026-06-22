const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || "test@ethereal.email",
      pass: process.env.SMTP_PASS || "testpass",
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.SMTP_USER ? `"SacredAura" <${process.env.SMTP_USER}>` : '"SacredAura" <orders@sacredaura.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", options.email);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
