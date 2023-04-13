// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// sub_cat Schema
const sub_catSchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    sub_cat: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Sub_cat", sub_catSchema);