const express = require('express');
const session = require("express-session");
const cors = require("cors");
const mongoose = require('mongoose');
const sessionStore = require("connect-mongodb-session");

const userRoutes = require('./routes/userRoutes.js');
const locationRoutes = require('./routes/locationRoutes.js');
const videoRoutes = require('./routes/videoRoutes.js');
const apiRoutes = require('./routes/apiRoutes.js');
const { userAuth, userNotAuth } = require("./middleware/userAuth.js");

const PORT = process.env.PORT || 8080;
const PUBLIC_PATH = __dirname + "/client";
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qtjeo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const DB_URI = "mongodb://localhost/mapcast";

// Create express app with HTTP server
const app = express();

// Set the view engine to ejs for template rendering
app.set("view engine", "ejs");

// Cross-Origin Resource Sharing
app.use(cors());

// Make JSON sent in the request body available as req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(PUBLIC_PATH));

// Create user sessions and store in database
const MongoDBStore = sessionStore(session);
app.use(session({
	secret: process.env.SESSION_SECRET,
	store: new MongoDBStore({
		uri: DB_URI,
		collection: "sessions",
	}),
	resave: true,
	saveUninitialized: true,
}));

// Routes
app.get('/signin', userNotAuth, (req, res) => res.render("pages/signin"));

app.get('/', userAuth, (req, res) => res.render("pages/index", { username: req.session.username }));
app.get('/settings', userAuth, (req, res) => res.render("pages/settings", { username: req.session.username }));
app.get('/help', userAuth, (req, res) => res.render("pages/help"));

app.use('/user', userRoutes);
app.use('/location', locationRoutes);
app.use('/video', videoRoutes);
app.use('/api', apiRoutes);

// Page not found - standard redirect
app.use((req, res) => res.redirect("/"));

// Connect to database
mongoose.connect(DB_URI, { useNewUrlParser: true });

// Start server listening for requests
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
