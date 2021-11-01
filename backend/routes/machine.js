const express = require("express");
const mongoose = require("mongoose");
const machineJs = require("../models/machine");
// const Machine = require("../models/machine");

const machineSchema = new mongoose.Schema({}, { strict: false });
const Machine = mongoose.model("Dynamic", machineSchema);

const router = express.Router();

router.get("/", (req, res, next) => {
  Machine.find()
    .select({ _id: 0, __v: 0 })
    .then((documents) => {
      // console.log(documents);
      res.status(200).json({
        message: "Machines fetched successfully!",
        machines: documents,
      });
    });
});

router.get("/:id", (req, res, next) => {
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
  const data = req.body;
  Machine.insertMany(data, (err, data) => {
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
