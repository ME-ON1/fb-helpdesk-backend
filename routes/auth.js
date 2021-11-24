const express = require("express");


const router = express.Router()
const axios = require("axios")

const {getPageAccessToken, UserSaveHdl} = require("../controllers/auth")

router.post("/Save-User", UserSaveHdl)
