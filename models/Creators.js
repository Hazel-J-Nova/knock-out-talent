const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContentSchema = require("./Content");
const UserSchema = require("./Users");
ImageSchema = new Schema({
  url: String,
  filename: String,
});

const CreatorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  name: String,
  content: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  avatar: ImageSchema,
  categories: [String],
  bio: String,
  subscribers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  totalRevenue: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  Id: { type: Boolean, default: false },
  Face: { type: Boolean, default: false },
  FaceId: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },

  account: String,
  linkedBankAccount: { type: Boolean, deafault: false },
});

module.exports = mongoose.model("Creators", CreatorSchema);
