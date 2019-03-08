var express = require('express');
const Babysitter = require('../models/Babysitter');
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const babySitterArray = await Babysitter.find();
    res.render('home', { babySitterArray });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
