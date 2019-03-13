const Contract = require('../models/Contract');

module.exports = {
  async deleteContractMiddleWare (req, res, next) {
    try {
      const { id } = req.params;
      await Contract.findByIdAndDelete(id);
      res.redirect('/profile/message');
    } catch (error) {
      next(error);
    }
    next();
  }
};
