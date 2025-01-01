const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const usersController = require("../controllers/users.js"); // Fixed path typo


// Render the signup form
router
    .route("/signup")
    .get(usersController.renderSignupForm)
    .post(wrapAsync(usersController.signup)); 


// Render the login form
router
    .route("/login")
    .get(usersController.renderLoginForm)
    .post(
      
      saveRedirectUrl,
      passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
      }),
      usersController.login
    );


// Logout route
router.get("/logout", usersController.logout);

module.exports = router;
