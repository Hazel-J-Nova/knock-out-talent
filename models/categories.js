const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title:{type:String,
        required: true
    },
    content:  [{
        type: Schema.Types.ObjectId,
        ref: 'Content'}]
});

module.exports = mongoose.model("Category", CategorySchema);
