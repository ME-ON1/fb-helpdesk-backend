const mongoose = require("mongoose");

const url = process.env.SERVER_SECRET || "localhost:27017";
try {
	mongoose.connect(
		uri,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => {
			console.log("Db OK!! ");
		}
	);
} catch (Err) {
	throw Err;
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));
