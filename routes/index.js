var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { userIsNotLogged } = require('../middlewares/auth');
const parser = require('../helpers/file-upload');

var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const babySitterArray = await User.find({ userType: 'babysitter' });

    // LOGICA
    // quan parent solicita babysitter --> stateBabysitter = Pending || stateParent = Pending
    // Babysitter tindrà bullet quant pending i parent no quan està en pending
    // Quan babysitter contesta --> stateBabysitter = opcio || stateParent = opcio
    // Parent tindrà bullet quan stateParent sigui Accepted o Decline, babysitter no bullet perque state es opcio
    // Parent marqui Ok, borrem contracte.

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

router.get('/profile/message', userIsNotLogged, async (req, res, next) => {
  try {
    const currentUser = req.session.currentUser;
    if (currentUser) {
      const contractParent = await Contract.find({ parent: currentUser._id }).populate('babysitter');
      const contractBabysitter = await Contract.find({ babysitter: currentUser._id }).populate('parent');

      res.render('message', { contractParent, contractBabysitter });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id', userIsNotLogged, async (req, res, next) => {
  const { id } = req.params;
  const userCookie = req.session.currentUser;
  let isMyUser = false;
  let isBabySitter = false;
  try {
    const userSelected = await User.findById(id);
    if (id === userCookie._id) {
      isMyUser = true;
    } else {
      if (userSelected.userType === 'babysitter') {
        isBabySitter = true;
      }
    }

    res.render('profile', { userSelected, isMyUser, isBabySitter });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/edit', userIsNotLogged, async (req, res, next) => {
  try {
    res.render('edit-profile');
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/hire', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = {};

    contract.parent = req.session.currentUser._id;
    contract.babysitter = id;
    await Contract.create(contract);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:id/update', userIsNotLogged, parser.single('image'), async (req, res, next) => {
  const { username, description } = req.body;
  const { id } = req.params;
  try {
    let editUser = {};
    if (req.file) {
      editUser = {
        username,
        description,
        imageUrl: req.file.url
      };
    } else {
      editUser = {
        username,
        description
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, editUser, { new: true });
    req.session.currentUser = updatedUser;
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
