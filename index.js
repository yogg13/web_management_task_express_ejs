const express = require("express");
const session = require("express-session");

const app = express();
const port = 3000;

const secret = {
	secret: "secret-key",
	resave: false,
	saveUninitialized: true,
	cookie: {},
}; //Dummy Setup secret for session management

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.use(session(secret)); // Middleware for session management

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
