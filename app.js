require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const passport = require("passport");
var FbStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const User = require("./model/userSchema");
var app = express();
const axios = require("axios");
const cors = require("cors")



app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: "SECRET",
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
	cors({
		origin: "http://localhost:3000", // allow to server to accept request from different origin
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true // allow session cookie from browser to pass through
	})
);
passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

passport.use(
	new FbStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.SECRET,
			callbackURL: process.env.CB_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			const curr_user = {
				first_name: profile._json.name,
				id: profile._json.id,
				access_token: accessToken,
				page_access_token: "",
			};


			const AccountPage = await axios.get(
				process.env.GP_URL +
				"me?fields={email,gender,link,accounts,picture}&access_token=" +
				accessToken
			)

			// get the latest page_access_token
			curr_user.page_access_token = AccountPage.data.data[0].access_token
			curr_user.picture = AccountPage.data.data.picutre.data
			curr_user.profile_link = AccountPage.data.data.link
			curr_user.email = AccountPage.data.data.email
			curr_user.gender = AccountPage.data.data.gender



			const CurrUser = await User.findOne({email: curr_user.id})

			if (!CurrUser) {

				const user = new User(curr_user)

				await user.save()
				return done(null, curr_user);
			}
			else {
				//update page_access_token its volatile
				CurrUser.page_access_token = AccountPage.curr_user.page_access_token
				await CurrUser.save()
				return done(null, CurrUser)
			}

			//TODO : curr -Only works for single page of an auth user exten to multiple

		}
	)
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/backend", usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
});

module.exports = app;
