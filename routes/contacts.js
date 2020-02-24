const express		= require("express"),
	  router		= express.Router({mergeParams: true}),
	  Campground	= require("../models/campground"),
	  Contact		= require("../models/contact"),
	  middleware	= require("../middleware");

router.get("/", function(req, res) {
	Campground.findById(req.params.id).populate("contacts").exec(function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Could not access campground information");
			res.redirect("back");
		} else {
			res.render("contacts/show", {campground: foundCampground});
		}
	});
});

// contact NEW
router.get("/new", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Could not access campground information");
			res.redirect("back");
		} else {
			res.render("contacts/new", {campground: foundCampground});
		}
	});
});

// contact CREATE
router.post("/", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Could not add contact information");
			res.redirect("back");
		} else {
			Contact.create(req.body.contact, function(err, contact) {
				if (err || !contact) {
					req.flash("error", "Could not create contact");
				} else {
					if (contact.image == "") {
						contact.image = "https://www.mywardrobehq.com/assets/images/profiles/no-image.png";
					}
					if (contact.name == "") {
						contact.name = "No Name Given";
					}
					if (contact.title == "") {
						contact.title = "No Title Given";
					}
					if (contact.email == "") {
						contact.email = "No Email Given";
					}
					if (contact.phoneNumber == "") {
						contact.phoneNumber = "No Number Given";
					}
					contact.save();
					foundCampground.contacts.push(contact);
					foundCampground.save();
					req.flash("success", "Contact has been added successfully");
					res.redirect("/campgrounds/" + foundCampground._id + "/contacts");
					
					console.log(contact);
				}
			});
		}
	});
});

// contacts EDIT route
router.get("/:contact_id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Contact not found in campground");
			return res.redirect("back");
		}
		Contact.findById(req.params.contact_id, function(err, foundContact) {
			if (err) {
				res.redirect("back");
			} else {
				res.render("contacts/edit", {campground_id: req.params.id, contact: foundContact});
			}
		});
	});
});

// contacts UPDATE route
router.put("/:contact_id", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
	if (req.body.contact.image == "") {
		req.body.contact.image = "https://www.mywardrobehq.com/assets/images/profiles/no-image.png";
	}
	if (req.body.contact.name == "") {
		req.body.contact.name = "No Name Given";
	}
	if (req.body.contact.title == "") {
		req.body.contact.title = "No Title Given";
	}
	if (req.body.contact.email == "") {
		req.body.contact.email = "No Email Given";
	}
	if (req.body.contact.phoneNumber == "") {
		req.body.contact.phoneNumber = "No Number Given";
	
	}
	Contact.findByIdAndUpdate(req.params.contact_id, req.body.contact, function(err, foundContact) {
		if (err) {
			req.flash("error", "Could not update contact");
			res.redirect("back");
		} else {
			req.flash("success", "Contact updated");
			res.redirect("/campgrounds/" + req.params.id + "/contacts");
		}
	});
});

// contacts DELETE route
router.delete("/:contact_id", middleware.checkCampgroundOwnership, function(req, res) {
	Contact.findByIdAndRemove(req.params.contact_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Contact deleted");
			res.redirect("/campgrounds/" + req.params.id + "/contacts");
		}
	});
});

module.exports = router;