var express = require("express");
var router = express.Router();
const axios = require("axios");

const {isLoggedIn} = require("../helper/helper");
const {CustomerDetails, AgentDetails, MsgPulseHdl} = require("../controllers/controller");

router.get("/AgentDetails", isLoggedIn, AgentDetails);
router.get("/customerDetails", isLoggedIn, CustomerDetails);



router.post("/msg-pulse", isLoggedIn, MsgPulseHdl)

module.exports = router;
