const mongoose = require("mongoose");
const crypto = require("crypto");

function encrypt(text) {
	var cipher = crypto.createCipher(
		"aes-256-gcm",
		process.env.SERVER_SECRET
	);
	var crypted = cipher.update(text, "utf8", "hex");
	crypted += cipher.final("hex");
	return crypted;
}

function decrypt(text) {
	if (text == null || typeof text === "undefined") {
		return text;
	}

	var decipher = crypto.createDecipher(
		"aes-256-gcm",
		process.env.SERVER_SECRET
	);

	var dec = decipher.update(text, "utf8");
	dec += decipher.final("utf8");

	return dec;
}

const PictureSchema = new mongoose.Schema({
	height: {
		type: Number,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	width: {
		type: Number,
		required: true
	},
	is_silhouette: {
		type: Boolean
	}

})
const AgentSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
	id: {
		type: String,
	},
	last_name: {
		required: true,
		type: String,
	},
	access_token: {
		get: decrypt,
		set: encrypt,
		type: String,
	},
	page_access_token: {
		get: decrypt,
		set: encrypt,
		type: String,
	},
	profile_link: {
		type: String,
	},
	gender: {
		type: String,
	},
	picture: {
		type: PictureSchema,
		required: true
	}
}, {
	timestamps: true
});



const User = mongoose.model("User", AgentSchema);

module.exports = User;
