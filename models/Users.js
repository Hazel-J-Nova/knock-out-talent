//jshint esversion:9
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.models = {};
mongoose.modelSchemas = {}

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
    },
    creator: Boolean,
    admin: Boolean,
    
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
