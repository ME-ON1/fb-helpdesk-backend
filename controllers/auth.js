const passport = require("passport");
const {isLoggedIn} = require("../helper/helper.js");
const User = require("../model/userSchema")

const axios = require("axios")

exports.LogOut = (req, res, next) => {
	req.logout();
	res.redirect("/");
};

exports.ProfileHdl = async (req, res, next) => {
	return res.json({info: req.user});
};

exports.LogInPageRenderHdl = async (req, res, next) => {
	res.render("pages/index.ejs"); // load the index.ejs file
};

exports.errorHdl = async (req, res, next) => {
	res.send("Sorry for the trouble")
};

// for getting page_access_token to cntrol comments, post
exports.getPageAccessToken = (req, res, next) => {


}



exports.UserSaveHdl = async (req, res, next) => {

	const {accessToken, email, id, name, picture, page_access_token} = req.body

	const new_user = {
		access_token: accessToken,
		page_access_token,
		email,
		id,
		name,
		picture
	}

	try {

		const user = await User(new_user)
		await user.save()
	}
	catch (err) {
		throw new Error(err)
	}
}
