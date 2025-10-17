const express = require('express');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');


const authenticateToken = require('../authentication/authenticateToken')

//register route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Required to fill all the fields' })
  }
  else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: `User saved ${username, password}` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save user' });
    }
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Request failed' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,         // include _id to associate tasks
        username: user.username
      },
      process.env.SECRET_TOKEN,
      { expiresIn: '15m' }
    );


    // Send token in response body instead of cookie
    res.status(200).json({ message: 'Login successful', token: accessToken });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});


router.get('/todo', authenticateToken, (req, res, next) => {
  res.status(200).json({ message: 'Profile accessed', user: req.user });
})

router.delete('/logout', (req, res) => {
  // Client should just discard the token
  res.status(200).json({ message: 'Logged out successfully. Discard the token on client.' });
});




module.exports = router;