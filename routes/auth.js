'use strict';

var express = require('express');
const User = require('../models/User');
const Babysitter = require('../models/Babysitter');
const { userIsLogged, userIsNotLogged } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

const saltRounds = 10;
var router = express.Router();

// Signup
router.get('/signup', userIsLogged, (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', userIsLogged, async (req, res, next) => {
  const { username, password, email, userType } = req.body;
  console.log(userType);
  try {
    // commprobar tots els camps plens
    if (!username || !password || !email || !userType) {
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
    // comprobar quin tipo dusuari tenim

    // tipo user

    if (userType === 'user') {
      const createdUser = await User.create(newUser);
      req.session.currentUser = createdUser;
    } else if (userType === 'babysitter') {
      const createdUser = await Babysitter.create(newUser);
      req.session.currentUser = createdUser;
    }

    // redirect home
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------

// Log in
router.get('/login', userIsLogged, (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', userIsLogged, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // commprobar tots els camps plens
    if (!username || !password) {
      res.redirect('/auth/login');
      return;
    }

    // comprobar credencials
    const user = await User.findOne({ username });
    if (!user) {
      console.log('This username is not on db');
      res.redirect('/auth/login');
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log('Login!');
      res.redirect('/');
      return;
    } else {
      console.log('Error password!');
      res.redirect('/auth/login');
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/logout', userIsNotLogged, (req, res, next) => {
  delete req.session.currentUser;
  console.log('logout');
  res.redirect('/');
});

module.exports = router;
