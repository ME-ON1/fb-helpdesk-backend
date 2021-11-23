var express = require("express");
var router = express.Router();
const axios = require("axios");

const { isLoggedIn } = require("../helper/helper");

/* GET users listing. */
router.get("/", isLoggedIn, async (req, res, next) => {
	console.log(req.user.id, req.user.accessToken);
	axios.get(
		"https://graph.facebook.com/v12.0/" +
			req.user.id +
			"/accounts?access_token=" +
			req.user.accessToken
	).then((resp) => {
		console.log(resp.data);
		axios.get(
			"https://graph.facebook.com/v12.0/me?access_token=" +
				resp.data.access_token
		).then((ru) => {
			console.log(ru);
		});
		return res.json({ info: resp.data });
	});
});

router.get("/backend/getmsg/");

module.exports = router;
