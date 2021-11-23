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

const UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		require: true,
	},
	id: {
		type: String,
	},
	last_name: {
		require: true,
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
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
