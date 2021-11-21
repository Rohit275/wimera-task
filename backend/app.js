const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var collectionvals = ["Value"];
const machineRoutes = require("./routes/machine");

const app = express();
const conn = mongoose
  .connect("mongodb://localhost/wimer-task2")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to Mongo DB...", err));
//
//var collections = mongoose.connections[0].collections;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/machines", machineRoutes);

function passcollections() {
  var val = "hi";
  return val;
}

module.exports = app;
