"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash("password123", salt);

		await queryInterface.bulkInsert("Users", [
			{
				username: "johndoe",
				email: "john@example.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				username: "janedoe",
				email: "jane@example.com",
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
