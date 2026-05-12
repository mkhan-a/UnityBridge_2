const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();

router.post('/api/users', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      zipCode
    } = req.body;

    if (!firstName || !lastName || !email || !password || !zipCode) {
      return res.status(400).json({
        message: 'First name, last name, email, password, and ZIP code are required.'
      });
    }

    // Check if email already exists
    const existingUser = await sql.query`
            SELECT UserID
            FROM Users
            WHERE Email = ${email}
        `;

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        message: 'An account with that email already exists. Please log in.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await sql.query`
            INSERT INTO Users
                (FirstName, LastName, Email, PasswordHash, ZipCode, UserRole, CreatedAt)
            OUTPUT INSERTED.UserID
            VALUES
                (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${zipCode}, 'User', GETDATE())
        `;

    const userId = result.recordset?.[0]?.UserID;

    res.status(201).json({
      message: 'User created successfully',
      userId: userId
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      message: 'DB error. Could not create user.'
    });
  }
});

module.exports = router;