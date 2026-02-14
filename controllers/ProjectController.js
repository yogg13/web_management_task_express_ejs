const { Project, Task, User } = require("../models");

class ProjectController {
	static async list(req, res) {
		try {
			const projects = await Project.findAll({
				where: { userId: req.session.userId },
				include: [{ model: Task, as: "tasks" }],
				order: [["createdAt", "DESC"]],
			});

			const successMsg = req.session.successMsg;
			const errorMsg = req.session.errorMsg;
			delete req.session.successMsg;
			delete req.session.errorMsg;

			res.render("projects/index", {
				projects,
				username: req.session.username,
				successMsg,
				errorMsg,
			});
		} catch (error) {
			req.session.errorMsg = "Failed to load projects";
			res.redirect("/projects");
		}
	}

	static showCreate(req, res) {
		const errorMsg = req.session.errorMsg;
		delete req.session.errorMsg;
		res.render("projects/create", {
			username: req.session.username,
			errorMsg,
		});
	}

	static async create(req, res) {
		try {
			const { name, description, status } = req.body;
			await Project.create({
				name,
				description,
				status: status || "active",
				userId: req.session.userId,
			});
			req.session.successMsg = "Project created successfully!";
			res.redirect("/projects");
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				req.session.errorMsg = error.errors.map((e) => e.message).join(", ");
			} else {
				req.session.errorMsg = "Failed to create project";
			}
			res.redirect("/projects/create");
		}
	}

	static async detail(req, res) {
		try {
			const project = await Project.findOne({
				where: { id: req.params.id, userId: req.session.userId },
				include: [
					{
						model: Task,
						as: "tasks",
						include: [
							{ model: User, as: "assignee", attributes: ["id", "username"] },
						],
					},
				],
				order: [[{ model: Task, as: "tasks" }, "createdAt", "DESC"]],
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			const successMsg = req.session.successMsg;
			const errorMsg = req.session.errorMsg;
			delete req.session.successMsg;
			delete req.session.errorMsg;

			res.render("projects/detail", {
				project,
				username: req.session.username,
				successMsg,
				errorMsg,
			});
		} catch (error) {
			req.session.errorMsg = "Failed to load project";
			res.redirect("/projects");
		}
	}

	static async showEdit(req, res) {
		try {
			const project = await Project.findOne({
				where: { id: req.params.id, userId: req.session.userId },
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			const errorMsg = req.session.errorMsg;
			delete req.session.errorMsg;

			res.render("projects/edit", {
				project,
				username: req.session.username,
				errorMsg,
			});
		} catch (error) {
			req.session.errorMsg = "Failed to load project";
			res.redirect("/projects");
		}
	}

	static async update(req, res) {
		try {
			const { name, description, status } = req.body;
			const project = await Project.findOne({
				where: { id: req.params.id, userId: req.session.userId },
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			await project.update({ name, description, status });
			req.session.successMsg = "Project updated successfully!";
			res.redirect(`/projects/${project.id}`);
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				req.session.errorMsg = error.errors.map((e) => e.message).join(", ");
			} else {
				req.session.errorMsg = "Failed to update project";
			}
			res.redirect(`/projects/${req.params.id}/edit`);
		}
	}

	static async delete(req, res) {
		try {
			const project = await Project.findOne({
				where: { id: req.params.id, userId: req.session.userId },
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			await project.destroy(); // Tasks will be cascade deleted
			req.session.successMsg = "Project deleted successfully!";
			res.redirect("/projects");
		} catch (error) {
			req.session.errorMsg = "Failed to delete project";
			res.redirect("/projects");
		}
	}
}

module.exports = ProjectController;
