const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const ContentSchema = new Schema({
  title: String,
  price: [Number],
  sales: Number,
  revenue: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Creator",
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
  subscriptionTier: String,
  tags: [String],
  category: String,
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Content", ContentSchema);
