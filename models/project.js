"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Project extends Model {
		static associate(models) {
			Project.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
			Project.hasMany(models.Task, { foreignKey: "projectId", as: "tasks" });
		}
	}
	Project.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Project name is required" },
					notEmpty: { msg: "Project name cannot be empty" },
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM("active", "completed", "archived"),
				allowNull: false,
				defaultValue: "active",
				validate: {
					isIn: {
						args: [["active", "completed", "archived"]],
						msg: "Status must be active, completed, or archived",
					},
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "Project",
		},
	);
	return Project;
};
