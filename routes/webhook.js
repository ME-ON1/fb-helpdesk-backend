const processPostback = require('../process/postback');
const processMessage = require('../process/messages');


module.exports = function (app, chalk) {
	app.get('/webhook', function (req, res) {
		if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
			console.log('webhook verified');
			res.status(200).send(req.query['hub.challenge']);
		} else {
			console.error('verification failed. Token mismatch.');
			res.sendStatus(403);
		}
	});

	app.post('/webhook', function (req, res) {
		if (req.body.object === 'page') {

			req.body.entry.forEach(function (entry) {
				entry.messaging.forEach(function (event) {
					console.log(event);
					if (event.postback) {
						processPostback(event);
					} else if (event.message) {
						processMessage(event);
					}
				});
			});
			res.sendStatus(200);
		}
	});
}
