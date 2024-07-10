const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/mailer');

const generateToken = (user) => {
  return jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });
};

exports.signup = (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Check if email already exists
  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create new user
    const newUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    };

    User.create(newUser, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare passwords
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Generate JWT token
      const token = generateToken(results[0]);
      return res.status(200).json({ token: token });
    });
  });
};

exports.getUserDetails = (req, res) => {
  const email = req.user.email; // Assuming email JWT token

  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = results[0];
    // Return user details without password
    return res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  // Generate reset token
  const resetToken = uuid.v4();
  const resetTokenExpires = Date.now() + 300000;

  // Update user with reset token and expiry
  User.updateResetToken(email, resetToken, resetTokenExpires, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send reset password email
    sendPasswordResetEmail(email, resetToken);

    return res.status(200).json({ message: 'Reset password link sent to email' });
  });
};

exports.resetPassword = (req, res) => {
  const { email, new_password, confirm_password } = req.body;

  if (new_password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Update user's password
  User.updatePassword(email, new_password, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Password updated successfully' });
  });
};
