"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Projects", [
			{
				name: "Website Redesign",
				description:
					"Redesign the company website with modern UI/UX. Includes new landing page, about page, and contact form.",
				status: "active",
				userId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "Mobile App Development",
				description:
					"Build a cross-platform mobile application for inventory management system.",
				status: "active",
				userId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "API Integration",
				description:
					"Integrate third-party payment gateway and shipping APIs into existing e-commerce platform.",
				status: "completed",
				userId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Projects", null, {});
	},
};
