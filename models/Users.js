const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const ContentSchema = require("./Content");

mongoose.models = {};
mongoose.modelSchemas = {};

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  creator: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  purchases: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  emailVerified: { type: Boolean, default: false },
  token: { type: String, default: "" },
  appliedForCreator: { type: Boolean, default: false },
  readyToLinkBankAccount: { type: Boolean, default: false },
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
