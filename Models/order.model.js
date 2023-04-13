const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    paymentOption: {
      type: String,
      required: true,
      default: 'unpaid',
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    cashier: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.methods.getOrders = function () {
  console.log('order==========================');
}

module.exports = mongoose.model("Order", orderSchema);
