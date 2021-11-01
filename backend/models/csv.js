const mongoose = require("mongoose");

const csv = new mongoose.Schema({
  Name: { type: String },
  Type: { type: String },
  Signal: { type: String },
  angSignal: { type: String },
  modbus: { type: Number },
});

module.exports = mongoose.model("CSV", csv);
