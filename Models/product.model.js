const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    cost_price: {
        type: Number,
        required: true,
        default: 0,
    },
    selling_price: {
        type: Number,
        required: true,
        default: 0,
    },
    media: {
        type: Object,
    },
    size: {
        type: String,
    },
    category: {
        type: String,
    },
    sub_cat: {
        type: String,
    },
    // categoryId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Category",
    // },
    // sub_catId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Sub_cat",
    // },
    qty: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);