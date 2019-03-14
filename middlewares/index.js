const Contract = require('../models/Contract');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  async deleteContractMiddleWare (req, res, next) {
    try {
      const { id } = req.params;
      const contract = await Contract.findByIdAndDelete(id);
      if (!contract) {
        next();
      }
      res.redirect('/profile/message');
      return;
    } catch (error) {
      next(error);
    }
    next();
  },
  isIdValid (req, res, next) {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
      next();
    } else {
      return res.redirect('/');
    }
  }
};
