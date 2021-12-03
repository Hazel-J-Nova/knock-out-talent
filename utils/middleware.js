const Creator = require("../models/Creators");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.hasPurchased = async (req, res, next) => {
  const { contentId } = req.params;
  let user = req.session.passport.user;
  const activeUser = await User.findOne({ username: user });
  if (
    !activeUser.purchases.include(contentId) ||
    !activeUser.content.include(contentId)
  ) {
    req.flash("error", "You must own the content to comment on it");
    return res.redirect(`/${contentId}`);
  }
  next();
};

module.exports.isCreator = async (req, res, next) => {
  const user = req.user;
  next();
};

module.exports.checkAdmin = async (req, res, next) => {
  const user = req.user;
  if (!req.user.admin) {
    req.flash("error", "You do not have permission to do that");
    res.redirect("/");
  }
  next();
};
