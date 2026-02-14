"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Tasks", [
			{
				title: "Design wireframes",
				description: "Create wireframes for all pages using Figma",
				status: "done",
				priority: "high",
				dueDate: new Date("2026-03-01"),
				projectId: 1,
				assignedTo: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Implement homepage",
				description: "Code the homepage based on approved wireframes",
				status: "in_progress",
				priority: "high",
				dueDate: new Date("2026-03-15"),
				projectId: 1,
				assignedTo: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Setup responsive CSS",
				description: "Ensure all pages are mobile-responsive",
				status: "todo",
				priority: "medium",
				dueDate: new Date("2026-03-20"),
				projectId: 1,
				assignedTo: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Setup React Native project",
				description: "Initialize the project with required dependencies",
				status: "in_progress",
				priority: "high",
				dueDate: new Date("2026-03-10"),
				projectId: 2,
				assignedTo: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Design database schema",
				description: "Plan the database structure for inventory system",
				status: "todo",
				priority: "medium",
				dueDate: new Date("2026-03-12"),
				projectId: 2,
				assignedTo: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				title: "Implement Stripe integration",
				description: "Connect Stripe payment gateway with checkout flow",
				status: "done",
				priority: "high",
				dueDate: new Date("2026-02-28"),
				projectId: 3,
				assignedTo: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Tasks", null, {});
	},
};
