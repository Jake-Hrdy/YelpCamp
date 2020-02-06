const express			= require("express"),
	  app				= express(),
	  bodyParser		= require("body-parser"),
	  mongoose 			= require("mongoose"),
	  flash				= require("connect-flash"),
	  passport			= require("passport"),
	  LocalStrategy		= require("passport-local"),
	  methodOverride	= require("method-override"),
	  Campground 		= require("./models/campground"),
	  Comment			= require("./models/comment"),
	  User				= require("./models/user"),
	  seedDB 			= require("./seeds");

// requiring routes
const campgroundRoutes	= require("./routes/campgrounds"),
	  commentRoutes 	= require("./routes/comments"),
	  indexRoutes		= require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const dbURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(dbURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret: "YelpCamp is the best app ever",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seed database on start up
// seedDB();

app.listen(process.env.PORT || 3000, process.env.IP);
// app.listen(3000, function() {
// 	console.log("The YelpCamp server has started.");
// });