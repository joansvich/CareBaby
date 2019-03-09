var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { userIsNotLogged } = require('../middlewares/auth');
const parser = require('../helpers/file-upload');

var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const currentUser = req.session.currentUser;
    const babySitterArray = await User.find({ userType: 'babysitter' });
    const currentUserJs = await User.findById(currentUser._id);
    res.render('home', { babySitterArray, currentUserJs });
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
  let isMyUser = false;
  try {
    if (id === currentUser._id) {
      isMyUser = true;
    }
    const currentUserJs = await User.findById(id);
    res.render('profile', { currentUserJs, isMyUser });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/edit', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserJs = await User.findById(id);
    res.render('edit-profile', { currentUserJs });
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:id/update', userIsNotLogged, parser.single('image'), async (req, res, next) => {
  const { username, description } = req.body;
  const { id } = req.params;
  try {
    const editUser = {
      username,
      description,
      imageUrl: req.file.url
    };

    await User.findByIdAndUpdate(id, editUser);
    res.redirect(`/profile/${id}`);
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
