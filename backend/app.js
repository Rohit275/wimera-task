const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const CSV = require("./models/csv");
// const Machine = require("./models/machine");

const machineRoutes = require("./routes/machine");

const app = express();

mongoose
  .connect("mongodb://localhost/wimer-task2")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to Mongo DB...", err));

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

// router.post("/", (req, res, next) => {
//   let machine = new Machine({
//     name: req.body.name,
//     type: req.body.type,
//     signal: req.body.signal,
//     angSignal: req.body.angSignal,
//     modbus: req.body.modbus,
//   });

//   machine.save().then((createdMachine) => {
//     console.log(createdMachine);
//     res.status(201).json({
//       message: "Machine added succesfully!",
//       machineId: createdMachine._id,
//     });
//   });
// });

// app.post("/api/import", (req, res) => {
//   const data = req.body;
//   Machine.insertMany(data, (err, data) => {
//     if (err) {
//       res.status(400).json({
//         message: "There is some error to Uploading CSV!",
//       });
//     } else {
//       res.status(200).json({
//         message: "File Uploaded Successfully!",
//       });
//     }
//   });
// });

module.exports = app;
