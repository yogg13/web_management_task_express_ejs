const { Task, Project, User } = require("../models");

class TaskController {
	static async showCreate(req, res) {
		try {
			const project = await Project.findOne({
				where: { id: req.params.projectId, userId: req.session.userId },
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			const users = await User.findAll({ attributes: ["id", "username"] });
			const errorMsg = req.session.errorMsg;
			delete req.session.errorMsg;

			res.render("tasks/create", {
				project,
				users,
				username: req.session.username,
				errorMsg,
			});
		} catch (error) {
			req.session.errorMsg = "Failed to load task form";
			res.redirect("/projects");
		}
	}

	static async create(req, res) {
		try {
			const { title, description, status, priority, dueDate, assignedTo } =
				req.body;

			const project = await Project.findOne({
				where: { id: req.params.projectId, userId: req.session.userId },
			});

			if (!project) {
				req.session.errorMsg = "Project not found";
				return res.redirect("/projects");
			}

			await Task.create({
				title,
				description,
				status: status || "todo",
				priority: priority || "medium",
				dueDate: dueDate || null,
				projectId: project.id,
				assignedTo: assignedTo || null,
			});

			req.session.successMsg = "Task created successfully!";
			res.redirect(`/projects/${project.id}`);
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				req.session.errorMsg = error.errors.map((e) => e.message).join(", ");
			} else {
				req.session.errorMsg = "Failed to create task";
			}
			res.redirect(`/projects/${req.params.projectId}/tasks/create`);
		}
	}

	static async showEdit(req, res) {
		try {
			const task = await Task.findByPk(req.params.id, {
				include: [
					{
						model: Project,
						as: "project",
						where: { userId: req.session.userId },
					},
				],
			});

			if (!task) {
				req.session.errorMsg = "Task not found";
				return res.redirect("/projects");
			}

			const users = await User.findAll({ attributes: ["id", "username"] });
			const errorMsg = req.session.errorMsg;
			delete req.session.errorMsg;

			res.render("tasks/edit", {
				task,
				users,
				username: req.session.username,
				errorMsg,
			});
		} catch (error) {
			req.session.errorMsg = "Failed to load task";
			res.redirect("/projects");
		}
	}

	static async update(req, res) {
		try {
			const { title, description, status, priority, dueDate, assignedTo } =
				req.body;

			const task = await Task.findByPk(req.params.id, {
				include: [
					{
						model: Project,
						as: "project",
						where: { userId: req.session.userId },
					},
				],
			});

			if (!task) {
				req.session.errorMsg = "Task not found";
				return res.redirect("/projects");
			}

			await task.update({
				title,
				description,
				status,
				priority,
				dueDate: dueDate || null,
				assignedTo: assignedTo || null,
			});

			req.session.successMsg = "Task updated successfully!";
			res.redirect(`/projects/${task.projectId}`);
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				req.session.errorMsg = error.errors.map((e) => e.message).join(", ");
			} else {
				req.session.errorMsg = "Failed to update task";
			}
			res.redirect(`/tasks/${req.params.id}/edit`);
		}
	}

	static async updateStatus(req, res) {
		try {
			const { status } = req.body;

			const task = await Task.findByPk(req.params.id, {
				include: [
					{
						model: Project,
						as: "project",
						where: { userId: req.session.userId },
					},
				],
			});

			if (!task) {
				return res.status(404).json({ error: "Task not found" });
			}

			await task.update({ status });
			res.json({ success: true, task });
		} catch (error) {
			res.status(500).json({ error: "Failed to update task status" });
		}
	}

	static async delete(req, res) {
		try {
			const task = await Task.findByPk(req.params.id, {
				include: [
					{
						model: Project,
						as: "project",
						where: { userId: req.session.userId },
					},
				],
			});

			if (!task) {
				req.session.errorMsg = "Task not found";
				return res.redirect("/projects");
			}

			const projectId = task.projectId;
			await task.destroy();

			req.session.successMsg = "Task deleted successfully!";
			res.redirect(`/projects/${projectId}`);
		} catch (error) {
			req.session.errorMsg = "Failed to delete task";
			res.redirect("/projects");
		}
	}
}

module.exports = TaskController;
