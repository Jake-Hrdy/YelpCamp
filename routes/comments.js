const express 		= require("express"),
	  router		= express.Router({mergeParams: true}),
	  Comment		= require("../models/comment"),
	  Campground	= require("../models/campground"),
	  middleware	= require("../middleware");

// comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else if (comment.rating < 1 || comment.rating > 5) {
					req.flash("error", "Rating has to be between 1 and 5");
					res.redirect("/campgrounds/" + req.params.id + "/comments/new");
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success", "Comment has been added successfully");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

// comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	if (req.body.comment.rating < 1 || req.body.comment.rating > 5) {
		req.flash("error", "Rating has to be between 1 and 5");
		return res.redirect("/campgrounds/" + req.params.id + "/comments/" + req.params.comment_id + "/edit");
	}
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// comments delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;