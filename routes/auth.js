'use strict';

var express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const saltRounds = 10;
var router = express.Router();

// Signup
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    // commprobar tots els camps plens
    if (!username || !password || !email) {
      res.redirect('/auth/signup');
      return;
    }

    // comprobar que el usuari està a la db
    const result = await User.findOne({ username });
    if (result) {
      console.log('This username is taken');
      res.redirect('/auth/signup');
      return;
    }

    // encriptar password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // crear user
    const newUser = {
      username,
      password: hashedPassword,
      email
    };
    const createdUser = await User.create(newUser);

    // redirect home
    res.redirect('/');
    // res.render('auth/signup');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
