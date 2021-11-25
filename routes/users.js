var express = require("express");
var router = express.Router();
const axios = require("axios");

const {isLoggedIn} = require("../helper/helper");
const {CustomerDetails, AgentDetails} = require("../controllers/controller");


const GRAPH_API = "https://graph.facebook.com/v12.0/"


router.get("/AgentDetails", isLoggedIn, AgentDetails);
router.get("/customerDetails", isLoggedIn, CustomerDetails);

router.post("/post-comments", async (req, res, next) => {
	const {id, message} = req.body
	const {page_access_token} = req.user

	axios.post(GRAPH_API + `${id}&access_token=${page_access_token}`, {
		message: message
	})

})

router.post("/hide-comments", async (req, res, next) => {

	const {id, is_hidden} = req.body
	const {page_access_token} = req.user

	axios.post(GRAPH_API + `${id}?access_token=${page_access_token}`).then(res => {

		return res.status(201).json({success: true, msg: "Internal Server Error"})
	}).catch(err => {

		return res.status(500).json({success: false, msg: "Internal Server Error"})
	})
})

router.post("/like-comment", async (req, res, next) => {

	const {page_access_token} = req.user
	axios.post(GRAPH_API + "likes&access_token=" + page_access_token).then(res => {
		return res.status(200).json({success: res.data.success})
	}).catch(err => {
		return res.status(500).json({success: "Internal Server Error!"})
	})


})

// ====================================== MESENGET =================================//


module.exports = router;
