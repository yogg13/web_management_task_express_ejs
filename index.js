const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(methodOverride("_method")); // Support PUT & DELETE via query string
app.use(express.static("public")); // Serve static files (CSS, images, etc.)

app.use(
	session({
		secret: "management-task-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
	}),
);

const router = require("./routers");
app.use("/", router);

app.listen(port, () => {
	console.log(`Management Task app listening on http://localhost:${port}`);
});
