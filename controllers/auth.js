const passport = require("passport");
const { isLoggedIn } = require("../helper/helper.js");

exports.LogOut = (req, res, next) => {
	req.logout();
	res.redirect("/");
};

exports.ProfileHdl = async (req, res, next) => {
	return res.json({ info: req.user });
};

exports.LogInPageRenderHdl = async (req, res, next) => {
	res.render("pages/index.ejs"); // load the index.ejs file
};

exports.errorHdl = async (req, res, next) => {
	res.render("pages/error.ejs");
};
