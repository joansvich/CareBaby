module.exports = {
  userIsLogged (req, res, next) {
    if (req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },
  userIsNotLogged (req, res, next) {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  }
};
