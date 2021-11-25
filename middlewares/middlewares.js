exports.authCheck = (req, res, next) => {
	res.render("profile.ejs", {
		user: "tarun"
	})
}
