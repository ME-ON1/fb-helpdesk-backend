var express = require("express");
var router = express.Router();
const axios = require("axios");
const {fmt_for_react_use} = require("../helper/helper")
const {isLoggedIn} = require("../helper/helper");
const {CustomerDetails, AgentDetails} = require("../controllers/controller");


const GRAPH_API = "https://graph.facebook.com/v12.0/"


router.get("/AgentDetails", isLoggedIn, AgentDetails);
router.get("/customerDetails", isLoggedIn, CustomerDetails);

let page_access_token = "EAAMlp2AXZCNgBAL7cnWh3Ei7WEVXOdtuKctVfOPdR2oe0O4uUbUTSP5W3EbIOGdltDL2TX3b1NEiJH68SfFyM9j2NDG0odSN4oeGtqp1UJbhKk0OV0VdsreCRk9OHolH4u1s1vKF9Y3xYNOQalscVIRZC959wxzlvdz0HLCkg5O6XySTbEaha3hwwKsdvyZCfOleNlpC9059oIwZCo6Y"


router.post("/post_comments", async (req, res, next) => {
	const {id, message} = req.body
	console.log("id")
	//let {page_access_token} = req.user


	axios.post(GRAPH_API + `${id}/comments?message=${message}&access_token=${page_access_token}`).then((resp) => {

		if (resp.status === 200) return res.status(200).send({success: true})
		else {

			return res.status(500).json({success: false})
		}
	}).catch(err => {
		console.log(err)
		return res.status(500).json({success: false})
	})

})

router.post("/hide-comments", async (req, res, next) => {

	const {id, is_hidden} = req.body
	//const {page_access_token} = req.user

	axios.post(GRAPH_API + `${id}/is_hidden=${is_hidden}?access_token=${page_access_token}`, {
		"is_hidden": is_hidden
	}).then(resp => {

		if (resp.status = 200) return res.status(201).json({success: true, msg: "Internal Server Error"})

		return res.status(500).json({success: false})
	}).catch(err => {

		return res.status(500).json({success: false, msg: "Internal Server Error"})
	})
})

router.post("/like-comment", async (req, res, next) => {

	//const {page_access_token} = req.user
	const {object_id} = req.body
	axios.post(GRAPH_API + object_id + "likes&access_token=" + page_access_token).then(resp => {
		if (resp.status == 200) return res.status(200).json({success: res.data.success})

		return res.status(500).json({success: false})
	}).catch(err => {
		return res.status(500).json({success: "Internal Server Error!"})
	})


})

// ====================================== INBOX  =================================//

router.post("/inbox", async (req, res, next) => {

	const {page_access_token} = req.body
	console.log("TRUAN")
	axios.all([
		axios.get(
			GRAPH_API
			+ "me/posts?fields=id,message,comments{id,from,is_hidden,message,created_time},created_time&access_token="
			+ page_access_token
		),
		axios.get(GRAPH_API
			+ "me/conversations?fields=id,senders,messages{from,message,created_time}&access_token=" + page_access_token)
	]).then(axios.spread((...resp) => {
		const fmt_data_comments = fmt_for_react_use(resp[0].data.data);
		if (resp[0].status == 200 && resp[0].status === 200) return res.status(200).json({success: true, posts: fmt_data_comments, message: resp[1].data.data})
	})).catch(err => {

		console.log("error ", err)
		return res.status(500).json({success: false})
	})
})




module.exports = router;
