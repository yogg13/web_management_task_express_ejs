"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Project, { foreignKey: "userId", as: "projects" });
			User.hasMany(models.Task, {
				foreignKey: "assignedTo",
				as: "assignedTasks",
			});
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: "Username already exists" },
				validate: {
					notNull: { msg: "Username is required" },
					notEmpty: { msg: "Username cannot be empty" },
					len: {
						args: [3, 30],
						msg: "Username must be between 3 and 30 characters",
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: "Email already exists" },
				validate: {
					notNull: { msg: "Email is required" },
					notEmpty: { msg: "Email cannot be empty" },
					isEmail: { msg: "Must be a valid email address" },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Password is required" },
					notEmpty: { msg: "Password cannot be empty" },
					len: {
						args: [6, 100],
						msg: "Password must be at least 6 characters",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "User",
			hooks: {
				beforeCreate: async (user) => {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				},
			},
		},
	);

	// Instance method to validate password
	User.prototype.validPassword = async function (password) {
		return await bcrypt.compare(password, this.password);
	};

	return User;
};
