const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password'
  }
});

exports.sendPasswordResetEmail = (email, resetToken) => {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Reset your password',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process within 5 minutes of receiving it:\n\n` +
          `http://localhost:3000/reset-password?token=${resetToken}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    }
    console.log('Email sent: ' + info.response);
  });
};
