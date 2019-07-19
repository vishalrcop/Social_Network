const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
dotenv.config();
const morgan = require('morgan');

//db. //If mongodb is installed in device
// MONGO_URI = mongodb://localhost/nodeapi
mongoose.connect(
	process.env.MONGO_URI, 
	{useNewUrlParser : true}
	)
.then(() => console.log('DB Connected'));
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

//bring in routers
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error : 'Unauthorized!!!'});
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`A node Api is listing on port number: ${port}`);
});
