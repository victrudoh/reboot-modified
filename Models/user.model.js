const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  username: {
    type: String,
    required: 'please enter username',
  },
  email: {
    type: String,
    required: 'please enter email address',
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  physicalAddress: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  isCartEmpty: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});

userSchema.methods.addToCart = function (product, qty) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = qty;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + (+ parseInt(qty));
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    console.log(productId);
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = {items: []};
  return  this.save();
};

module.exports = mongoose.model("User", userSchema);
