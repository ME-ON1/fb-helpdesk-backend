exports.isLoggedIn = (req, res, next) => {
	console.log("sdfs");
	if (req.isAuthenticated()) return next();
	res.redirect("/");
};
