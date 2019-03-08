var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    console.log(req.session.currentUser);
    const babySitterArray = await User.find({ userType: 'babysitter' });
    res.render('home', { babySitterArray });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', async (req, res, next) => {
  try {
    res.render('profile');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
