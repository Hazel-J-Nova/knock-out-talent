const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  subject: String,
  htmlBody: String,
  textBody: String,
});

module.exports = mongoose.model("Email", EmailSchema);
