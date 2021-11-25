var express = require("express");
var router = express.Router();
const passport = require("passport");
const axios = require("axios")
const {isLoggedIn} = require("../helper/helper");

const CLIENT_REDIRECT_URL = "http://localhost:3000"


//const {
//PassportAuthentication,
//LogOut,
//AuthRedirect,
//ProfileHdl,
//LogInPageRenderHdl,
//errorHdl,
//} = require("../controllers/auth");

//router.get("/", LogInPageRenderHdl);
//router.get("/profile", isLoggedIn, ProfileHdl);
//router.get("/error", isLoggedIn, errorHdl);
//router.get(
//"/auth/facebook",
//passport.authenticate("facebook",)
//);
router.get(
	"/auth/facebook",
	passport.authenticate("facebook", {
		scope: [
			"email",
			"pages_show_list",
			"pages_messaging",
			"pages_messaging_subscriptions",
			"pages_read_engagement",
			"pages_manage_metadata",
			"pages_read_user_content",
			"page_events",
			"public_profile",
		],
	})
);

router.get(
	"/facebook/redirect",
	passport.authenticate("facebook", {
		successRedirect: CLIENT_REDIRECT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/login/success", async (req, res, next) => {
	console.log(req.user)
	if (req.user) {
		res.json({
			success: true,
			message: "YE LO USER ID",
			user: req.user,
			cookies: req.cookies
		})
	}
	else {
		res.json({
			success: false
		})
	}
})


router.get("/login/failed", (req, res, next) => {
	res.status(401).json({
		success: false,
		message: "user failed "
	})
})

router.get("/logout", async (req, res, next) => {
	req.logout();
	req.redirect("http://localhost:8089")
});


module.exports = router
