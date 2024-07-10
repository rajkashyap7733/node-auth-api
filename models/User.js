const db = require('../config');
const bcrypt = require('bcryptjs');

class User {
  static findByEmail(email, callback) {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static create(newUser, callback) {
    // Hash password before storing in DB
    bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      newUser.password = hashedPassword;
      db.query('INSERT INTO users SET ?', newUser, callback);
    });
  }

  static updatePassword(email, newPassword, callback) {
    // Hash new password before updating
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }
      db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], callback);
    });
  }

  static updateResetToken(email, resetToken, resetTokenExpires, callback) {
    db.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [resetToken, resetTokenExpires, email], callback);
  }
}

module.exports = User;
