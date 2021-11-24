const {default: axios} = require("axios");

exports.CustomerDetails = async (req, res, next) => {
	return res.json({sdf: "Sdf"});
};

exports.AgentDetails = async (req, res, next) => {
	const {page_access_token, access_token} = req.user;

	const page_details = {} /*await axios.get(*/
	/*process.env.GP_URL +*/
	/*"me?fields=name,id,link&access_token=" +*/
	/*page_access_token*/
	/*);*/

	return res.status(200).json({
		data: page_details
	});
};


exports.MsgPulseHdl = async (req, res, next) => {

	const {page_access_token} = req.user
	const io = req.app.get('socketio')

	let interval;
	io.on('connection', socket => {

		if (interval) {
			socket.on('disconnect', "ended")
		}
		interval = setInterval(() => getEmit((socket, page_access_token), 1000))
		socket.on('pulse', user_data => {
			console.log("just got a msg here ")

		})
	})
}

const getEmit = async (socket, page_access_token) => {
	const rs = await axios.get(process.env.GP_URL + "/me/accounts?access_token=" + page_access_token)


	socket.emit('msg-pulse', rs.data)
}
