const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const ProjectController = require("../controllers/ProjectController");
const TaskController = require("../controllers/TaskController");
const { authentication, isGuest } = require("../middlewares/authentication");

router.get("/", (req, res) => {
	if (req.session && req.session.userId) {
		return res.redirect("/projects");
	}
	res.redirect("/login");
});

router.get("/register", isGuest, AuthController.showRegister);
router.post("/register", isGuest, AuthController.register);
router.get("/login", isGuest, AuthController.showLogin);
router.post("/login", isGuest, AuthController.login);
router.post("/logout", AuthController.logout);
router.use(authentication); // All routes below require login

// --- Projects ---
router.get("/projects", ProjectController.list);
router.get("/projects/create", ProjectController.showCreate);
router.post("/projects/create", ProjectController.create);
router.get("/projects/:id", ProjectController.detail);
router.get("/projects/:id/edit", ProjectController.showEdit);
router.put("/projects/:id", ProjectController.update);
router.delete("/projects/:id", ProjectController.delete);

// --- Tasks ---
router.get("/projects/:projectId/tasks/create", TaskController.showCreate);
router.post("/projects/:projectId/tasks/create", TaskController.create);
router.get("/tasks/:id/edit", TaskController.showEdit);
router.put("/tasks/:id", TaskController.update);
router.patch("/tasks/:id/status", TaskController.updateStatus);
router.delete("/tasks/:id", TaskController.delete);

module.exports = router;
