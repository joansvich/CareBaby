var express = require('express');
const Babysitter = require('../models/Babysitter');
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const isLogin = true;
    const babySitterArray = await Babysitter.find();
    res.render('home', { isLogin, babySitterArray });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
