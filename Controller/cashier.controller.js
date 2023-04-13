const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const categoryModel = require("../Models/category.model");
const sub_catModel = require("../Models/sub_cat.model");

module.exports = {
    getOrderController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const query = {};
        for (let value of Object.keys(req.body)) {
            query[value] = req.body[value];
        }

        const orders = await Order.find(query).populate("cashier", "username");

        res.render("cashier/cashier_orders", {
            pageTitle: "Orders",
            path: "orders",
            orders: orders,
            role: req.user.role,
            errorMessage: message,
        });
    },

    postSearchOrdersController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        if (!orders.cashier) {
            return res.status(400).send("order not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const active = req.session.user._id;
        const cashier = await User.findOne({ role: "cashier", _id: active });

        const orderId = req.body.orderId;
        const orders = await Order.findById(orderId).populate(
            "cashier",
            "username"
        );
        if (!orders) {
            req.flash("error", "Sorry, we can't find your order");
            return res.redirect("/cashier/findOrders");
        }
        if (orders.cashier.username !== cashier.username) {
            req.flash("error", "Sorry, you can't access this order, please contact admin");
            // console.log('Cashier: ', orders.cashier.username);
            // console.log('Cashier: ', cashier.username);
            return res.redirect("/cashier/findOrders");
        }


        if (orders.cashier.username === cashier.username || orders.cashier === null) {
            console.log("okay this works in postSearchOrdersController >>>>>>>>>");
        }

        res.render("cashier/cashier_searched_order", {
            pageTitle: "Orders",
            path: "orders",
            order: orders,
            role: req.user.role,
            errorMessage: message,
        });
    },

    getViewOrderController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const orderId = req.params.id;
        const orders = await Order.findById(orderId).populate(
            "cashier",
            "username"
        );
        res.render("cashier/cashier_view_order", {
            pageTitle: "View Order",
            path: "orders",
            role: req.user.role,
            order: orders,
        });
    },

    togglePaidController: async(req, res, next) => {
        const orderId = req.body.orderId;
        console.log("this is a comment on paid toggle", orderId);
        const order = await Order.findById(orderId);
        const cashier = await User.findOne({
            role: "cashier",
            username: req.session.user.username,
        });
        const orderState = order.paid;
        order.paid = !orderState;
        order.cashier = cashier._id;

        await order.save();
        res.redirect("/cashier/confirmedOrders");
    },

    getDashboardController: async(req, res, next) => {
        const active = req.session.user._id;
        const cashier = await User.findOne({ role: "cashier", _id: active });

        //products
        const prod = await Product.find();
        const prods = prod.length;

        //out of stock
        const outProd = await Product.find({ isDisabled: true });
        const outProds = outProd.length;

        //pending orders
        const pending = await Order.find({ paid: false, userId: cashier._id })
        const pendingOrders = pending.length;

        //confirmed orders
        const confirmed = await Order.find({ paid: 'true', cashier: active })
        const confirmedOrders = confirmed.length;


        res.render("cashier/dashboard", {
            pageTitle: "Dashboard",
            path: "dashboard",
            role: req.user.role,
            cashier: cashier,
            pendingOrders: pendingOrders,
            confirmedOrders: confirmedOrders,
            prods,
            outProds,
        });
    },

    getPendingOrdersController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const query = {};
        for (let value of Object.keys(req.body)) {
            query[value] = req.body[value];
        }

        const active = req.session.user._id;
        const cashier = await User.findOne({ role: "cashier", _id: active });

        const pending = await Order.find({ paid: false, userId: cashier._id });

        res.render("cashier/pendingOrders", {
            pageTitle: "Pending Orders",
            path: "dashboard",
            orders: pending,
            role: req.user.role,
            errorMessage: message,
        });
    },

    postPendingOrdersController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const orderId = req.body.orderId;
        const searchedId = await Order.findById({ _id: orderId })

        res.render("cashier/searchedOrder", {
            pageTitle: "Pending Orders",
            path: "dashboard",
            orders: pending,
            role: req.user.role,
        });

    },

    getConfirmedOrdersController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const query = {};
        for (let value of Object.keys(req.body)) {
            query[value] = req.body[value];
        }

        const active = req.session.user._id;
        const cashier = await User.findOne({ role: "cashier", _id: active });

        const confirmed = await Order.find({ paid: "true", cashier: active });

        res.render("cashier/confirmedOrders", {
            pageTitle: "Confirmed Orders",
            path: "dashboard",
            orders: confirmed,
            role: req.user.role,
            errorMessage: message,
            cashier: cashier,
        });
    },

    getFindOrderController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render("cashier/findOrder", {
            pageTitle: "Find Orders",
            path: "dashboard",
            role: req.user.role,
            errorMessage: message,
        });
    },

    getProductController: async(req, res, next) => {

        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()
            // const query = {}
            // console.log('req.body: ' , req.body);
            // for (let value of Object.keys(req.body)) {
            //   query[value] = req.body[value];
            // }

        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        Product.find({ isDisabled: false })
            .then((products) => {
                res.render("cashier/product_list", {
                    prods: products,
                    pageTitle: "Products",
                    path: "product_list",
                    role: req.user.role,
                    errorMessage: message,
                    categories,
                    sub_cats,
                });
            })
            .catch((err) => {
                console.log(err, "getProductController");
            });
    },

    postSortProductsController: async(req, res, next) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        if (!req.user) {
            return res.status(400).send("user not found")
        }

        const { category } = req.body;
        console.log("category:", category)

        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        Product.find({ category: req.body.category, isDisabled: false })
            .then((products) => {
                res.render("cashier/product_list", {
                    prods: products,
                    pageTitle: "Products",
                    path: "product_list",
                    role: req.user.role,
                    errorMessage: message,
                    categories,
                    sub_cats,
                });
            })
            .catch((err) => {
                console.log("🚀 ~ file: cashier.controller.js:312 ~ postSortProductsController:async ~ err:", err)
            });
    },

    postSortProductsBySubCatController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }

        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const { sub_cat } = req.body;
        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        Product.find({ sub_cat: sub_cat })
            .then((products) => {
                console.log("Products: ", products);
                res.render("cashier/product_list", {
                    prods: products,
                    pageTitle: "Products",
                    path: "dashboard",
                    categories,
                    sub_cats,
                    errorMessage: message,
                    role: req.user.role,
                    disable: false,
                });
            })
            .catch((err) => {
                console.log("🚀 ~ file: cashier.controller.js:339 ~ postSortProductsBySubCatController:async ~ err:", err)
            });
    },

    getProductByIdController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        const prodId = req.params.productId;
        Product.findById(prodId)
            .then((product) => {
                res.render("cashier/product_detail", {
                    product: product,
                    pageTitle: product.title,
                    path: "product_list", //so the products header will be active when we view the product
                    role: req.user.role,
                    errorMessage: message,
                });
            })
            .catch((err) => {
                console.log(err, "getProductByIdController");
            });
    },

    getAddProductController: async(req, res, next) => {
        res.render("cashier/edit_product", {
            pageTitle: "Add Product",
            path: "add_product",
            editing: false,
            role: req.user.role,
        });
    },

    postAddProductController: async(req, res, next) => {
        console.log("req.body: ", req.body);
        const title = req.body.title;
        const media = req.file;
        const price = req.body.price;
        const category = req.body.category;
        const inStock = req.body.inStock;
        const description = req.body.description;

        const product = new Product({
            title: title,
            media: media,
            price: price,
            category: category,
            inStock: inStock,
            description: description,
            userId: req.user,
            role: req.user.role,
        });
        product
            .save()
            .then((result) => {
                console.log("Created New Product");
                res.redirect("/cashier/products");
            })
            .catch((err) => {
                console.log(err, "postAddProductController");
            });
    },

    getEditProductController: async(req, res, next) => {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect("/");
        }
        const prodId = req.params.productId;
        Product.findById(prodId)
            .then((product) => {
                if (!product) {
                    return res.redirect("/cashier/products");
                }
                res.render("cashier/add_product", {
                    pageTitle: "Edit Product",
                    path: "dashboard",
                    editing: editMode,
                    product: product,
                    role: req.user.role,
                });
            })
            .catch((err) => {
                console.log(err, "getEditProductController");
            });
    },

    postEditProductController: async(req, res, next) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        console.log(req.body);
        if (!req.file) {
            req.flash("error", "Sorry, image is required");
            return res.redirect("/cashier/products");
        }
        const prodId = req.body.productId;
        const updatedTitle = req.body.title;
        const updatedMedia = req.file;
        const updatedPrice = req.body.price;
        const updatedCategory = req.body.category;
        const updatedInStock = req.body.inStock;
        const updatedDescription = req.body.description;
        Product.findById(prodId)
            .then((product) => {
                (product.title = updatedTitle),
                (product.media = updatedMedia),
                (product.price = updatedPrice),
                (product.category = updatedCategory),
                (product.inStock = updatedInStock),
                (product.description = updatedDescription);

                product.save();
            })
            .then((result) => {
                console.log("Updated Product");
                res.redirect("/cashier/products");
            })
            .catch((err) => {
                console.log(err, "postEditProductController");
            });
    },

};