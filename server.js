//Set enviroment variables
const dotenv = require('dotenv'); //must be the first two lines of code
dotenv.config({ path: './config.env' });

//Template for Node.js Express Server
const express = require('express');

//Create Express App
const app = express();

//body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
//app.use(bodyParser.json());

//Path module provides utilities for working file and directory paths
const path = require('path');

//dirname is the directory name of the current module
app.use(express.static(path.join(__dirname, 'public')));

//Use morgan for logging and debugging purposes
const morgan = require('morgan-body');
//middleware
//Create a write stream (in append mode)
var rfs = require('rotating-file-stream') //version 2.x
//Serve static files
//Create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', //rotate daily
  path: path.join(__dirname, 'log') //Log directory will log all data here
}); //set up the logger

morgan(app, {
  stream: accessLogStream,
  noColors: true,
  logReqUserAgent: true,
  logRequestBody: true,
  logResponseBody: true,
  logReqCookies: true,
  logReqSignedCookies: true
});

//Set the Node environment to development
// if (process.env.NODE_ENV === 'development') {
//     //app.use(morgan('combined :method :url :status :res[content-length] - :response-time ms'))
//     app.use(morgan('combined'))
// }

//Set the view engine to ejs
app.set('view engine', 'ejs');

//Set the views directory
app.set('views', 'views');

//routes are defined in the routes folder
const authenticationRoute = require('./routes/authenticationRoute');
app.use('/api', authenticationRoute);

//404 error page
app.use((err, req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

//connecting to the database
const mongoose = require('mongoose');

//asynchronous DB connection with parameterized DB connection string
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_DBSERVER}/${process.env.DATABASE}`
,{useNewUrlParser: true})
    .then(() => console.log(`MongoDB connection succeeded with ${process.env.DATABASE}...`))
    .catch((err) => console.log('Error in DB connection: ' + err));

//Start the Server. Default port is 3000
const port = process.env.PORT || 3000;

//app is listening on the port
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
