function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/steam');
}

module.exports = {
  ensureAuthenticated
};
