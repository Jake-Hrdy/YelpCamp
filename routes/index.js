const express 	= require("express"),
	  router	= express.Router(),
	  passport	= require("passport"),
	  User		= require("../models/user");

// root route
router.get("/", function(req, res) {
	res.render("landing");
});

// about page
router.get("/about", function(req, res) {
	res.render("about");
});

// show register form
router.get("/register", function(req, res) {
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
		if (err) {
			console.log(err.message);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", function(req, res) {
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: "Username or password is not correct.",
	successFlash: "Welcome Back!"
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});

module.exports = router;