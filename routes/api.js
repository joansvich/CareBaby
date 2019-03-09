const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/user', async (req, res, next) => {
  try {
    const allUsers = await User.find();
    const babysitters = allUsers.filter(user => {
      return user.userType === 'babysitter';
    });
    if (!babysitters.length) {
      res.status(404);
      res.json({ message: 'No hay canguros' });
      return;
    }
    res.json(babysitters);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
