const express = require("express");
const mongoose = require("mongoose");
const machineJs = require("../models/machine");
var app = require("../app");
var FileName;
var Machine;
const machineSchema = new mongoose.Schema({}, { strict: false });
var usercollection, keyValue;
//Machine = mongoose.model("JH check sheet (1).csv", machineSchema);
//import * as app from "./app.js";

// appFile = new app();
const router = express.Router();
mongoose.connection.on("open", (ref) => {
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    collectionvals = collections.map((collection) => {
      return collection.name;
    });
    var colldata = collectionvals.filter((data) => !data.includes("_keyvals"));
    if (colldata) {
      usercollection = colldata[0];
      // var keyval = usercollection.slice(0, usercollection.length - 1);
      // var keyvalvar = keyval + "_keyvals";
      // keyValue = collectionvals.some((data) => data.includes(keyvalvar));
      // console.log("keyval", keyvalvar);
      // console.log("KeyValue", keyValue);
    } else {
      console.log("No collections");
    }
  });
});

//const collectionvals = app.passcollections();

router.get("/", (req, res, next) => {
  if (usercollection == undefined) {
    return;
  }
  Machine = mongoose.model(usercollection, machineSchema);
  Machine.find()
    .select({ _id: 0, __v: 0 })
    .then((documents) => {
      res.status(200).json({
        message: "Machines fetched successfully!",
        machines: documents,
      });
    });
});

router.get("/machinekeyvalues", (req, res, next) => {
  if (usercollection == undefined) {
    return;
  }
  var keyvalcollection = usercollection.slice(0, usercollection.length - 1);
  Machine = mongoose.model(keyvalcollection + "_keyvals", machineSchema);
  Machine.find()
    .select({ _id: 0, __v: 0 })
    .then((documents) => {
      // console.log("MachineKey value function executed");
      res.status(200).json({
        message: "KeyValues fetched successfully!",
        machines: documents,
      });
    });
});

router.post("/usercollection", (req, res) => {
  let data = req.body.collection;
  if (data) {
    usercollection = data;
    res
      .status(201)
      .json({ message: "User Collection received in the backend" });
  }
});

router.get("/collections", (req, res) => {
  //var collectionvals = [];
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    collectionvals = collections.map((collection) => {
      return collection.name;
    });
    var colldata = collectionvals.filter((data) => !data.includes("_keyvals"));
    if (colldata) {
      console.log("Colldata", colldata);
      usercollection = colldata[0];
    } else {
      console.log("No collections");
    }
  });
  console.log("Collections in router: ", collectionvals);
  res.status(200).json(collectionvals);
});

router.get("/:id", (req, res, next) => {
  Machine = mongoose.model("jh check sheet (1).csvs", machineSchema);
  Machine.findById(req.params.id).then((machine) => {
    if (machine) {
      res.status(200).json(machine);
    } else {
      res.status(404).json({ message: "Machine not found!" });
    }
  });
});

router.post("/", (req, res, next) => {
  let data = new Machine(req.body);

  data.save().then((addedValue) => {
    console.log(addedValue);
    res.status(201).json({
      message: "Machine added succesfully!",
    });
  });
});

router.post("/import", (req, res) => {
  FileName = req.body.Name;
  const data = req.body.Data;
  MachineData = mongoose.model(FileName, machineSchema);
  MachineData.insertMany(data, (err, data) => {
    if (err) {
      res.status(400).json({
        message: "There is some error to Uploading CSV!",
      });
    } else {
      res.status(200).json({
        message: "Filtered File Uploaded Successfully!",
      });
    }
  });
});

// function callback() {
//   const machineSchema = new mongoose.Schema({}, { strict: false });
//   Machine = mongoose.model(FileName + "_KeyValue", machineSchema);
// }

router.post("/keyvalues", (req, res) => {
  FileName = req.body.Name;
  console.log("File Name", FileName);
  MachineKeyVal = mongoose.model(FileName + "_KeyVal", machineSchema);
  const data = new MachineKeyVal(req.body.Data);
  data.save().then(() => {
    res.status(201).json({
      message: "Key-Value Pairs added succesfully!",
    });
  });
});

router.post("/passHeaders", (req, res) => {
  const data = req.body;
  console.log("Received Headers in the Backend", data);
  machineJs(data);
});

router.put("/:id", (req, res, next) => {
  const machine = new Machine({
    _id: req.body.id,
    name: req.body.name,
    type: req.body.type,
    signal: req.body.signal,
    angSignal: req.body.angSignal,
    modbus: req.body.modbus,
  });
  // console.log("Before update: ", req.body.signalType);
  // console.log("Before update: ", req.body.analogSignal);
  console.log("Before update: ", req.body);
  Machine.updateOne({ _id: req.params.id }, machine).then((result) => {
    console.log("At update: ", req.body);

    console.log(result);

    // console.log(req.body);
    res.status(200).json({ message: "Update succesful!" });
  });
});

router.delete("/:id", (req, res, next) => {
  Machine.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
