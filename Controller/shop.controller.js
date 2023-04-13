const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const moment = require("moment");

module.exports = {
  getProductController: async (req, res, next) => {
    // const query = {}
    // console.log('req.body: ' , req.body);
    // for (let value of Object.keys(req.body)) {
    //   query[value] = req.body[value];
    // }
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    Product.find({ isDisabled: false })
      .then((products) => {
        res.render("shop/product_list", {
          prods: products,
          pageTitle: "Products",
          path: "product_list",
          role: req.user?.role,
          errorMessage: message,
        });
      })
      .catch((err) => {
        console.log(err, "getProductController");
      });
  },

  postSortProductsController: (req, res, next) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    Product.find({ category: req.body.category, isDisabled: false })
      .then((products) => {
        res.render("shop/product_list", {
          prods: products,
          pageTitle: "Products",
          path: "product_list",
          role: req.user?.role,
          errorMessage: message,
        });
      })
      .catch((err) => {
        console.log(err, "postSortProductsController");
      });
  },

  getProductByIdController: async (req, res, next) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    const prodId = req.params.productId;
    Product.findOne({ _id: prodId})
      .then((product) => {
        res.render("shop/product_detail", {
          product: product,
          pageTitle: product.title,
          path: "product_list", //so the products header will be active when we view the product
          role: req.user?.role,
          errorMessage: message,
        });
      })
      .catch((err) => {
        console.log(err, "getProductByIdController");
      });
  },

  getIndexController: async (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "index",
          role: req.user?.role,
        });
      })
      .catch((err) => {
        console.log(err, "getIndexController");
      });
  },
  getProfileController: async (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "index",
          role: req.user?.role,
        });
      })
      .catch((err) => {
        console.log(err, "getIndexController");
      });
  },

  getcartController: async (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
          path: "cart",
          pageTitle: "Your Cart",
          products: products,
          moment: moment,
          role: req.user.role,
        });
      })
      .catch((err) => console.log(err, "getcartController"));
  },

  postCartController: (req, res, next) => {
    const prodId = req.body.productId;
    const qty = req.body.qty;
    console.log(qty);
    console.log(prodId);
    Product.findById(prodId)
      .then((product) => {
        isCartEmpty = false;
        console.log(
          "🚀 ~ file: shop.controller.js ~ line 68 ~ .then ~ isCartEmpty",
          isCartEmpty
        );
        if (product.inStock < qty) {
          req.flash("error", "Sorry, we do not have that much");
          return res.redirect("/products");
        }
        return req.user.addToCart(product, qty);
      })
      .then((result) => {
        // console.log("result in postCartController: ", result);
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log(err, "postCartController");
      });
  },

  postCartDeleteProductController: (req, res, next) => {
    const prodId = req.body.id;
    req.user
      .deleteItemFromCart(prodId)
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err, "postCartDeleteProductController"));
  },

  postOrderController: async (req, res, next) => {
    // if (req.user.isCartEmpty) {
    //   return res.redirect('/cart');
    // }
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const products1 = user.cart.items.map(async (i) => {
      const qtyOrdered = i.quantity;
      const prodOrdered = i.productId._id;
      const prod = await Product.findById(prodOrdered);
      prod.inStock = prod.inStock - qtyOrdered;
      if (prod.inStock <= 0) {
        const productState = prod.isDisabled;
        prod.isDisabled = !productState;
      }
      if (prod.inStock < qtyOrdered) {
        console.log("e Plenty!!!");
      }
      await prod.save();
      console.log("prod.inStock: ", prod.inStock);
    });
    console.log("Quantity of goods: ", quantity);
    const newOrder = new Order({
      user: {  
        name: req.user.username,
        email: req.user.email,
      },
      userId: req.user._id,
      // cashier: req.user._id,
      products: products,
    });

    const order = await newOrder.save();
    isCartEmpty = true;
    await req.user.clearCart();
    res.redirect(`/checkout/${order.id}`);
  },

  getOrdersController: async (req, res, next) => {
    const query = { userId: req.user.id };
    for (let value of Object.keys(req.body)) {
      query[value] = req.body[value];
    }
    Order.find(query)
      .then((orders) => {
        res.render("shop/orders", {
          path: "orders",
          pageTitle: "Your Orders",
          orders: orders,
          role: req.user.role,
        });
      })
      .catch((err) => console.log(err, "getOrdersController"));
  },

  getInvoiceController: async (req, res) => {
    //i sha used stuff from the order controller because that's where i'm getting my data
    Order.find({ _id: req.params.id })
      .then((orders) => {
        res.render("shop/invoice", {
          path: "invoice",
          pageTitle: "Invoice",
          orders: orders,
          role: req.user.role,
          user: req.user,
        });
      })
      .catch((err) => console.log(err, "getInvoiceController"));
  },

  getReceiptController: async (req, res) => {
    const orders = await Order.findOne({ _id: req.params.id })
      res.render("shop/receipt", {
        path: "invoice",
        pageTitle: "Invoice",
        order: orders,
        role: req.user.role,
        user: req.user,
      });
  },

  getcheckoutController: async (req, res) => {
    Order.find({ _id: req.params.id })
      .then((orders) => {
        res.render("shop/checkout", {
          pageTitle: "Check Out",
          path: "/checkout",
          role: req.user.role,
          orders: orders,
          role: req.user.role,
          user: req.user,
        });
      })
      .catch((err) => console.log(err, "getInvoiceController"));
  },

  postCheckoutController: async (req, res, next) => {
    const payment = req.body.category;
    let found = await Order.findOne({ _id: req.params.id });
    found.paymentOption = payment;
    await found.save();
    res.redirect("/orders");
  },
};
