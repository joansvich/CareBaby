var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { userIsNotLogged } = require('../middlewares/auth');

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

router.get('/profile', userIsNotLogged, async (req, res, next) => {
  try {
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id', userIsNotLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  let myUser = false;
  try {
    if (id === currentUser._id) {
      myUser = true;
    }
    const user = await User.findById(id);
    res.render('profile', { user, myUser });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/edit', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('edit-profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/update', userIsNotLogged, async (req, res, next) => {
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

router.post('/profile/:id/delete', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    delete req.session.currentUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
