//jshint esversion:9

// to do make review model to link to content
// also need to do User model as well
// also learn about video downloads
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
	url: String,
	filename: String,
});

const UploadSchema = new Schema({
    url: String,
    filename: String
})

const ContentSchema = new Schema({
	title: String,
	price: Number,
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	images: [ImageSchema],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	description: String,
	subscription: Boolean,
	tags: [Strings],
	categories: [Strings],
	image: String,
});