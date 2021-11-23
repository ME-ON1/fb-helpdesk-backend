const passport = require("passport");

exports.PassportAuthentication = (req, res, next) => {
	passport.authenticate("facebook", {
		scope: ["public_profile", "email", "page_events"],
	});
	next();
};

exports.PassportRedirect = (req, res, next) => {
	passport.PassportRedirect("facebook", {
		successRedirect: "/backend",
		failureRedirect: "/error",
	});
	next();
};
