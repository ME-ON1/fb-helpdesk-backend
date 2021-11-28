const processPostback = require("../process/postback");
const processMessage = require("../process/messages");

module.exports = function (app, chalk) {
	app.get("/webhook", function (req, res) {
		console.log("reaching here ")
		if (
			req.query["hub.verify_token"] ===
			process.env.VERIFY_TOKEN
		) {
			console.log("webhook verified");
			res.status(200).send(req.query["hub.challenge"]);
		} else {
			console.error("verification failed. Token mismatch.");
			res.sendStatus(403);
		}
	});

	app.post("/webhook", function (req, res) {
		if (req.body.object === "page") {
			req.body.entry.forEach(function (entry) {
				entry.messaging.forEach(function (event) {
					console.log(event);

				});
			});
			console.log(req.body)
			res.sendStatus(200);
		}
	});

	app.get("/webhook/pages", async (req, res, next) => {
		if (req.query["hub.query_token"] == process.env.VERIFY_TOKEN) {
			console.log("token verofy");
			res.status(200).send(req.query["hub.challenge"]);
		} else {
			console.error("verification failed. Token mismatch.");
			res.sendStatus(403);
		}
	});
};
