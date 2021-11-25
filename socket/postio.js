const axios = require("axios")


module.exports = (io, app) => {


	let interval
	io.on('connection', (socket) => {
		console.log('connection initiateted')
		if (interval) {
			clearInterval(interval)
		}

		interval = setInterval(() => emitPulse(socket), 1000)

		socket.on('disconnect', data => {
			clearInterval(interval)
		})

	})
	const emitPulse = (socket, page_access_token) => {
		axios.get("https://graph.facebook.com/v12.0/me/posts?fields=id,message,from,created_time,comments{parent,from, created_time,is_hidden}&access_token=EAAMvtoHFBy4BALZChTLcsirzTzuKOx4AJI8LS8yBzLXh6A0xZA3Qmkz9qiRwWKol4P7CZA8exZAyLbvmcLZAfa0B6eWGcqASmHWJIf9T4sx07BY3YDrj38u1pxwVW0ArX9vDpkzquwsYjiwZBHxx2PhAJ1cIVOVVpioYUsNGhIRgrc3HPsahCZAACA5JstwgkLWhGIuF4MJDcWJFpLp7ZAE0").then(res => {
			console.log("res", res.data)
			const new_arr = []
			posts.data.forEach(message => {
				const parent = {
					permalink_url: message.permalink_url,
					from: message.from,
					created_time: message.created_time,
					id: message.id
				}
				message.comments.data.map(comments_thread => {
					// not making new thread for owner of the page
					// TODO something for authentiction maybe Router routes
					//if (comments_thread.from.id !== 102108588976918) {
					new_arr.push({
						parent: message,
						child: comments_thread
					})
					//}
				})
			})
			socket.emit("msg-pulse", new_arr)
		}).
			catch(err => {
				console.log(err)
				throw new Error
			})
	}
}
