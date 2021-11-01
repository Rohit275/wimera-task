const mongoose = require("mongoose");

var data = [];
function getHeaders(Headers) {
  data = Headers;
  console.log("Receive Headers in the Schema File", data);
}

module.exports = getHeaders;

// const machineSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, required: true },
//   signal: { type: String, required: true },
//   angSignal: { type: String, required: true },
//   modbus: { type: Number, required: true },
//
// var i;
// const machineSchema = new mongoose.Schema({
// for(i=0;i<data.length;i++){

// }
// });
