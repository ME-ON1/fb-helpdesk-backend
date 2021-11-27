exports.isLoggedIn = (req, res, next) => {
	console.log("sdfs");
	if (req.isAuthenticated()) return next();
	res.redirect("/");
};


exports.fmt_for_react_use = (data1) => {
	const top_arr = []
	console.log(data1)

	data1.forEach(val => {
		const parent_post = {
			id: val.id,
			message: val.message,
			from: val.from,
			created_time: val.created_time,
			permalink_url: val.permalink_url
		}
		if (val.comments !== undefined) {
			val.comments.data.map((comment, ind) => {
				const newObj = {
					parent_post: parent_post,
					child_comment: [comment]
				}
				top_arr.push(newObj)
			})
		}

	})
	return top_arr
}
