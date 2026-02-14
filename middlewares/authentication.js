const authentication = (req, res, next) => {
	if (req.session && req.session.userId) {
		return next();
	}
	req.session.authErrorMsg = "Please login first";
	return res.redirect("/login");
};

const isGuest = (req, res, next) => {
	if (req.session && req.session.userId) {
		return res.redirect("/projects");
	}
	return next();
};

module.exports = { authentication, isGuest };
