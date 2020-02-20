const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { port, mongo } = require("./config/vars.js");
const bookRoutes = require("./routes/book");
const authorRoutes = require("./routes/author");

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const app = express();

app.use(
  "/api/books",
  jsonParser,
  cors(),  
  bookRoutes
);
app.use(
  "/api/authors",
  jsonParser,
  cors(),  
  authorRoutes
);
app.use((err, req, res, next) => {
  // general error handling
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  if (err.data) {
    data = err.data;
  } else {
    data = "";
  }
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(mongo.uri, mongo.option)
  .then(result => {
    console.log("database start on " + mongo.uri);
  })
  .catch(err => {
      console.log(err);
  });
app.listen(port, () => {
  console.log("server start on port " + port);
});
