
// get packages
var fs = require("fs")
var path = require("path")
var express = require('express')
var cors = require('cors')
require('dotenv').config()
///加进去的1
var mongoose = require("mongoose");
const yourName="Romain"
const dbSchema = new mongoose.Schema({}, {
  strict: false,
  collection: yourName // bind schema to specific collection
});
const dbModel = mongoose.model(yourName, dbSchema);
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function callback() {
  console.log("database opened");
});

// --- INSTANTIATE THE APP
var app = express();

// manage cors policy
app.use(cors())

app.use(express.static(__dirname + '/public/'));

// set views
app.set('views', path.join(__dirname, '/public/'));

// set routes
app.get('/expNOW', function (request, response) {
  response.render('experiment.html');
});


// set view engigne
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//加进去的2
app.post("/save-file", function (request, response) {
  var datestr = new Date();
  datestr = String(datestr.toISOString()).replace(/:|\s+|_/g, '')
  var filename = String(request.body[request.body.length - 1].basename + "_" + datestr + ".json");
  dbModel.create(JSON.stringify(request.body));
  response.status(200).send({ message: 'success' });
});

// START THE SERVER
app.listen(3000, function () {
  console.log("Server running. To see the experiment that it is serving, visit the following address:");
  console.log("http://localhost:%d/expNOW", 3000);
});

