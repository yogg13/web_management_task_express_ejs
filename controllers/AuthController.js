const { User } = require("../models");
const bcrypt = require("bcrypt");

class AuthController {
	static showRegister(req, res) {
		const errorMsg = req.session.errorMsg;
		delete req.session.errorMsg;
		res.render("auth/register", { errorMsg });
	}

	static async register(req, res) {
		try {
			const { username, email, password } = req.body;
			await User.create({ username, email, password });
			req.session.successMsg = "Registration successful! Please login.";
			res.redirect("/login");
		} catch (error) {
			// Handle Sequelize validation errors
			if (
				error.name === "SequelizeValidationError" ||
				error.name === "SequelizeUniqueConstraintError"
			) {
				req.session.errorMsg = error.errors.map((e) => e.message).join(", ");
			} else {
				req.session.errorMsg = "Something went wrong. Please try again.";
			}
			res.redirect("/register");
		}
	}

	static showLogin(req, res) {
		const successMsg = req.session.successMsg;
		const errorMsg = req.session.errorMsg || req.session.authErrorMsg;
		delete req.session.successMsg;
		delete req.session.errorMsg;
		delete req.session.authErrorMsg;
		res.render("auth/login", { successMsg, errorMsg });
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ where: { email } });
			if (!user) {
				req.session.errorMsg = "Invalid email or password";
				return res.redirect("/login");
			}

			const isValid = await user.validPassword(password);
			if (!isValid) {
				req.session.errorMsg = "Invalid email or password";
				return res.redirect("/login");
			}

			// Set session
			req.session.userId = user.id;
			req.session.username = user.username;
			res.redirect("/projects");
		} catch (error) {
			req.session.errorMsg = "Something went wrong. Please try again.";
			res.redirect("/login");
		}
	}

	static logout(req, res) {
		req.session.destroy((err) => {
			res.redirect("/login");
		});
	}
}

module.exports = AuthController;
