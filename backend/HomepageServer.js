/*
const bcrypt = require('bcrypt');

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM Users WHERE Email = ?';

  pool.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    // No user found
    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = results[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.PasswordHash);

    if (!match) {
      return res.status(401).send('Invalid email or password');
    }

    res.send({
      message: 'Login successful',
      userId: user.id
    });
  });
});
*/
const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const result = await sql.query`
      SELECT UserID, FirstName, LastName, FullName, Email, PasswordHash, ZipCode, PreferredPhone, UserRole
      FROM Users
      WHERE Email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const user = result.recordset[0];

    const passwordMatches = await bcrypt.compare(password, user.PasswordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.UserID,
        firstName: user.FirstName,
        lastName: user.LastName,
        fullName: user.FullName,
        email: user.Email,
        zipCode: user.ZipCode,
        preferredPhone: user.PreferredPhone,
        userRole: user.UserRole
      }
    });

  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({
      message: 'Server error during login.'
    });
  }
});

module.exports = router;