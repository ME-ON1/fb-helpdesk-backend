var express = require("express");
var router = express.Router();
const passport = require("passport");

const { isLoggedIn } = require("../helper/helper");

const {
	PassportAuthentication,
	LogOut,
	AuthRedirect,
	ProfileHdl,
	LogInPageRenderHdl,
	errorHdl,
} = require("../controllers/auth");

router.get("/", LogInPageRenderHdl);
router.get("/profile", isLoggedIn, ProfileHdl);
router.get("/error", isLoggedIn, errorHdl);
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
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		successRedirect: "/profile",
		failureRedirect: "/error",
	})
);

router.get("/logout", LogOut);

module.exports = router;
module.exports = router;
