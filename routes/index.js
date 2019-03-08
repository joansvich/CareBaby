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

router.get('/profile/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render('profile', user);
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    res.render('edit-profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/update', async (req, res, next) => {
  const { username, description } = req.body;
  const currentUser = req.session.currentUser;
  try {
    const editUser = {
      username,
      description
    };
    await User.findOneAndUpdate(currentUser._id, editUser);
    res.redirect(`/profile/${currentUser._id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
