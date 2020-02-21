const mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
	name: String,
	title: String,
	image: String,
	email: String,
	phoneNumber: String
});

module.exports = mongoose.model("Contact", contactSchema);