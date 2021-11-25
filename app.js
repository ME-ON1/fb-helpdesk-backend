require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const passport = require("passport");
const http = require("http")
var FbStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const User = require("./model/userSchema");
const axios = require("axios");
const cors = require("cors")
const SocketIO = require("socket.io")

var app = express();
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: "SECRET",
	})
);

app.use(passport.initialize());
app.use(passport.session());
const whitelist = ["http://localhost:3000", "https://damp-castle-69501.herokuapp.com"]
//var corsOptions = {
//origin: function (origin, callback) {
//if (whitelist.indexOf(origin) !== -1) {
//callback(null, true);
//} else {
//callback(new Error("Not allowed by CORS"));
//}
//},
//methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//credentials: true // allow session cookie from browser to pass through
//};
app.use(
	cors({
		origin: function (origin, callback) {
			// bypass the requests with no origin (like curl requests, mobile apps, etc )
			if (!origin) return callback(null, true);

			if (whitelist.indexOf(origin) === -1) {
				var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		methods: "GET, POST, PUT"
	}
	));
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
			callbackURL: "/facebook/redirect",
		},
		async (accessToken, refreshToken, profile, done) => {

			const curr_user = {
				first_name: profile._json.name,
				id: profile._json.id,
				access_token: accessToken,
				page_access_token: "",
			};

			console.log(accessToken)
			try {
				const AccountPage = await axios.get(
					process.env.GP_URL +
					"me?fields={email,gender,link,accounts,picture}&access_token=" +
					accessToken
				)

				// get the latest page_access_token
				curr_user.page_access_token = AccountPage.data.data[0].access_token
				console.log(AccountPage.data)
			} catch (err) {
				throw new Error(err)
			}

			return done(null, curr_user)
			curr_user.profile_link = AccountPage.data.data.link
			curr_user.email = AccountPage.data.data.email
			curr_user.gender = AccountPage.data.data.gender

			try {

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


			} catch (Err) {
				throw new Error(Err)
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
require('./routes/webhook.js')(app);


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
const server = http.createServer(app)
const io = SocketIO(server, {cors: {origin: '*'}})

PORT = process.env.PORT || 8040

app.listen(PORT, () => {
	console.log("Server IS listentingi on ", PORT)
	mongoose.connect(process.env.DB_URL, () => {
		console.log("DB connected !!")
	})
})
