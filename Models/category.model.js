// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// category Schema
const categorySchema = new Schema({
    category: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);