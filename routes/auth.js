'use strict';

var express = require('express');
const User = require('../models/User');
const { userIsLogged, userIsNotLogged } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

const saltRounds = 10;
var router = express.Router();

// Signup
router.get('/signup', userIsLogged, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', userIsLogged, async (req, res, next) => {
  const { username, password, userType, latitude, longitude, location } = req.body;
  try {
    // commprobar tots els camps plens
    if (!username || !password || !userType) {
      req.flash('validation', 'Rellene todos los campos');
      res.redirect('/auth/signup');
      return;
    }

    // comprobar que el usuari està a la db
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'Este usuario ya existe');
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
      userType,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      city: location
    };

    const createdUser = await User.create(newUser);
    req.session.currentUser = createdUser;

    // redirect home
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// ----------------------------------------------------

// Log in
router.get('/login', userIsLogged, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', userIsLogged, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // commprobar tots els camps plens
    if (!username || !password) {
      req.flash('validation', 'Rellene todos los campos');
      res.redirect('/auth/login');
      return;
    }

    // comprobar credencials
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'El usuario no existe');
      res.redirect('/auth/login');
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log('Login!');
      res.redirect('/');
      return;
    } else {
      req.flash('validation', 'La contraseña es incorrecta');
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
