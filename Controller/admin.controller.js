// models
const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const categoryModel = require("../Models/category.model");
const sub_catModel = require("../Models/sub_cat.model");

// dependencies
const escapeStringRegexp = require("escape-string-regexp");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");



// const datauri = require("datauri");

module.exports = {
    // loginController: async (req, res) => {
    //   res.render("shop/product_list", {
    //     pageTitle: "Product List",
    //     path: "product_list",
    //     role: req.user.role,
    //   });
    // },

    getAddProductController: async(req, res, next) => {

        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        res.render("admin/add_product", {
            pageTitle: "Add Product",
            path: "add_product",
            editing: false,
            categories,
            sub_cats,
            role: req.user.role,
        });
    },

    postAddProductController: async(req, res, next) => {
        console.log("req.body: ", req.body);
        const { brand, cost_price, selling_price, size, category, sub_cat, qty, description } = req.body;
        const media = req.file;


        // const title = req.body.title;
        // const price = req.body.price;
        // const category = req.body.category;
        // const inStock = req.body.inStock;
        // const description = req.body.description;

        const product = new Product({
            brand,
            cost_price,
            selling_price,
            size,
            category,
            sub_cat,
            // categoryId: category,
            // sub_catId: sub_cat,
            qty,
            description,
            media,
            userId: req.user,
        });
        product
            .save()
            .then((result) => {
                console.log("Created New Product");
                res.redirect("/admin/products");
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
        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        Product.findById(prodId)
            .then((product) => {
                if (!product) {
                    return res.redirect("/");
                }
                console.log("Product: ", product);



                res.render("admin/edit_product", {
                    pageTitle: "Edit Product",
                    path: "dashboard",
                    editing: editMode,
                    product: product,
                    categories,
                    sub_cats,
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
        const { brand, cost_price, selling_price, size, category, sub_cat, qty, description } = req.body;
        const media = req.file;

        if (!req.file) {
            req.flash("error", "Sorry, image is required");
            return res.redirect("/admin/products");
        }

        const prodId = req.body.productId;
        const updatedbrand = brand;
        const updatedcost_price = cost_price;
        const updatedselling_price = selling_price;
        const updatedsize = size;
        const updatedcategory = category;
        const updatedsub_cat = sub_cat;
        const updatedqty = qty;
        const updatedMedia = file;
        const updatedDescription = description;
        Product.findById(prodId)
            .then((product) => {
                (product.brand = updatedbrand),
                (product.cost_price = updatedcost_price),
                (product.selling_price = updatedselling_price),
                (product.size = updatedsize),
                (product.category = updatedcategory),
                (product.sub_cat = updatedsub_cat),
                (product.qty = updatedqty),
                (product.media = updatedMedia),
                (product.description = updatedDescription);

                console.log("product: ", product)
                product.save();
            })
            .then((result) => {
                console.log("Updated Product");
                res.redirect("/admin/products");
            })
            .catch((err) => {
                console.log(err, "postEditProductController");
            });
    },

    getProductController: async(req, res, next) => {
        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        Product.find()
            // .select('title price -_id')
            //   .populate("userId", 'username')
            .then((products) => {
                res.render("admin/adminProduct_list", {
                    prods: products,
                    pageTitle: "Admin Products",
                    path: "dashboard",
                    categories,
                    sub_cats,
                    role: req.user.role,
                    disable: false,
                });
            })
            .catch((err) => {
                console.log(err, "getProductController");
            });
    },

    postSortProductsController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }

        const { category } = req.body;
        console.log("category:", category)

        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()

        Product.find({ category: req.body.category })
            .then((products) => {
                console.log("Products: ", products);
                res.render("admin/adminProduct_list", {
                    prods: products,
                    pageTitle: "Products",
                    path: "dashboard",
                    categories,
                    sub_cats,
                    role: req.user.role,
                    disable: false,
                });
            })
            .catch((err) => {
                console.log(err, "postSortProductsController");
            });
    },

    postSortProductsBySubCatController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }

        const { sub_cat } = req.body;
        const categories = await categoryModel.find()
        const sub_cats = await sub_catModel.find()
        Product.find({ sub_cat: sub_cat })
            .then((products) => {
                console.log("Products: ", products);
                res.render("admin/adminProduct_list", {
                    prods: products,
                    pageTitle: "Products",
                    path: "dashboard",
                    categories,
                    sub_cats,
                    role: req.user.role,
                    disable: false,
                });
            })
            .catch((err) => {
                console.log(err, "postSortProductsController");
            });
    },

    postDeleteProductController: (req, res, next) => {
        const prodId = req.body.productId;
        Product.findByIdAndRemove(prodId)
            .then(() => {
                console.log("Deleted Product");
                res.redirect("/admin/products");
            })
            .catch((err) => {
                console.log(err, "postDeleteProductController");
            });
    },

    getOrdersController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const query = {};
        console.log("from: ", req.body.date1);
        console.log("to: ", req.body.date2);
        // console.log("req.body: ", req.body);
        console.log("getOrdersController: ~ query", query);
        for (let value of Object.keys(req.body)) {
            if (value != "_csrf") {
                if (value.match(/date/g)) {
                    if (value == "date1") {
                        if (query["createdAt"]) {
                            query["createdAt"]["$gte"] = new Date(req.body[value]).setHours(00, 00, 00)
                        } else {
                            query["createdAt"] = { $gte: new Date(req.body[value]).setHours(00, 00, 00) }
                        }

                    }
                    if (value == "date2") {
                        if (query["createdAt"]) {
                            query["createdAt"]["$lte"] = new Date(req.body[value]).setHours(23, 59, 59)
                        } else {
                            query["createdAt"] = { $lte: new Date(req.body[value]).setHours(23, 59, 59) }
                        }

                    }
                    // } else if (value === "paymentOption") {
                    //   query[value] = req.body[value];
                } else {
                    query[value] = req.body[value];
                }
            }
        }

        console.log("getOrdersController: ~ query", query);
        Order.find(query)
            .populate("cashier", "username")
            .then((orders) => {
                res.render("admin/orders", {
                    path: "dashboard",
                    pageTitle: "All Orders",
                    orders: orders,
                    role: req.user.role,
                });
            })
            .catch((err) => console.log(err, "getOrdersController"));
    },

    getOrdersPaymentController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const query = {};
        for (let value of Object.keys(req.body)) {
            query[value] = req.body[value];
        }
        console.log('query: ', query);
        Order.find(query)
            .populate("cashier", "username")
            .then((orders) => {
                res.render("admin/orderspayment", {
                    path: "dashboard",
                    pageTitle: "All Orders",
                    orders: orders,
                    role: req.user.role,
                });
            })
            .catch((err) => console.log(err, "getOrdersController"));
    },

    getOrderByCashierController: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const query = {};
        for (let value of Object.keys(req.body)) {
            query[value] = req.body[value];
        }
        console.log('query: ', query);
        Order.find(query)
            .populate("cashier", "username")
            .then((orders) => {
                res.render("admin/ordersByCashier", {
                    path: "dashboard",
                    pageTitle: "All Orders",
                    orders: orders,
                    role: req.user.role,
                });
            })
            .catch((err) => console.log(err, "getOrdersController"));
    },

    postOrdersByCashier: async(req, res, next) => {
        if (!req.user) {
            return res.status(400).send("user not found")
        }
        const cashierWhoOrdered = req.body.cashierWhoOrdered;
        // console.log(cashierWhoOrdered, "cashierWhoOrdered");
        var i = 0;
        var cashier = [];
        const orders = await Order.find().populate("cashier", "username")
        for (i; i < orders.length; i++) {
            if (orders[i].user.name === cashierWhoOrdered) {
                cashier.push(orders[i]);
            }
        }
        console.log(cashier, "cashier");
        res.render("admin/ordersByCashier", {
            path: "dashboard",
            pageTitle: "All Orders",
            orders: cashier,
            role: req.user.role,
        });
    },


    toggleDisableProductController: async(req, res, next) => {
        const prodId = req.body.productId;
        console.log("this is a comment on product toggle", prodId);
        const product = await Product.findById(prodId);
        const productState = product.isDisabled;
        product.isDisabled = !productState;

        await product.save();
        res.redirect("/admin/products");
    },

    getDashboardController: async(req, res) => {
        const active = req.session.user._id;
        const admin = await User.findOne({ role: "admin", _id: active });


        const user = await User.find({ role: "cashier" });
        const users = user.length;

        const order = await Order.find();
        const orders = order.length;

        const prod = await Product.find();
        const prods = prod.length;

        const outProd = await Product.find({ isDisabled: true });
        const outProds = outProd.length;

        const getCategories = await categoryModel.find();
        const categories = getCategories.length;

        // const getSubCategories = await sub_catModel.find();
        // const sub_cats = getSubCategories.length;

        res.render("admin/dashboard", {
            pageTitle: "Dashboard",
            path: "dashboard",
            role: req.user.role,
            admin: admin,
            users: users,
            orders: orders,
            prods: prods,
            categories,
            // sub_cats,
            outProds: outProds,
        });
    },

    getUsersController: async(req, res, next) => {
        const users = await User.find({ role: "user", role: "cashier" });

        res.render("admin/users", {
            pageTitle: "All Users",
            path: "dashboard",
            editing: false,
            role: req.user.role,
            users,
        });
    },

    postEditUserController: async(req, res, next) => {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
        res.render("admin/edit_user", {
            pageTitle: "Edit User",
            path: "dashboard",
            editing: false,
            role: req.user.role,
            user,
        });
    },

    postUpdateUserController: async(req, res, next) => {
        const userId = req.body.userId;
        const updatedUsername = req.body.username;
        const updatedEmail = req.body.email;
        const updatedPassword = req.body.password;
        const updatedPhysicalAddress = req.body.physicalAddress;
        const updatedRole = req.body.role;

        const user = await User.findById(userId);

        user.username = updatedUsername;
        user.email = updatedEmail;
        user.password = updatedPassword;
        user.physicalAddress = updatedPhysicalAddress;
        user.role = updatedRole;

        await user.save();
        res.redirect("/admin/users");
    },

    getDisabledProductsController: async(req, res, next) => {
        const prods = await Product.find({ isDisabled: true });
        const disabledMode = req.query.disable;
        console.log("getDisabledProductsController: ~ disabledMode", disabledMode);

        res.render("admin/adminProduct_list", {
            pageTitle: "Disabled Products",
            path: "dashboard",
            role: req.user.role,
            disable: disabledMode,
            prods,
        });
    },

    postUploadController: async(req, res, next) => {
        console.log(req.file);
        console.log(req.file.filename);

        let path;

        if (req.file.mimetype === "image/jpeg") {
            path = req.file.filename;
        } else {
            path = null;
        }

        res.render("admin/test", {
            pageTitle: "",
            path: "dashboard",
            role: req.user.role,
            path,
        });
    },

    postUploadExcelController: async(req, res, next) => {
        try {
            const active = req.session.user._id;
            const admin = await User.findOne({ role: "admin", _id: active });

            console.log('req.file: ', req.file);

            if (
                req.file.mimetype ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                req.file.mimetype === "application/vnd.ms-excel"
            ) {
                console.log("Excel file...");
                let filePath = req.file.filename;
                let readExcelFile = xlsx.readFile(filePath);
                let sheetName = readExcelFile.SheetNames[0];
                let sheetValue = readExcelFile.Sheets[sheetName];
                let convertToJSON = xlsx.utils.sheet_to_json(sheetValue);
                console.log("convertToJSON", convertToJSON);
                convertToJSON.map(async(update) => {
                    const updatedbrand = update.brand;
                    const updatedcost_price = update.cost_price;
                    const updatedselling_price = update.selling_price;
                    const updatedcategory = update.category;
                    const updatedsub_cat = update.sub_cat;
                    const updatedDescription = update.description;
                    const updatedsize = update.size;
                    const updatedqty = update.qty;
                    // const updatedMedia = update.media;

                    const product = await Product.findOne({
                        brand: updatedbrand,
                        category: updatedcategory,
                    }).exec();
                    console.log(
                        "🚀 ~ file: admin.controller.js ~ line 347 ~ convertToJSON.map ~ product",
                        product
                    );
                    if (!product) {
                        const newProd = await new Product({
                            media: null,
                            userId: admin,
                            brand: updatedbrand,
                            cost_price: updatedcost_price,
                            selling_price: updatedselling_price,
                            size: updatedsize,
                            category: updatedcategory,
                            sub_cat: updatedsub_cat,
                            qty: updatedqty,
                            description: updatedDescription,
                        });
                        await newProd.save();
                        console.log("saved new product: ", newProd.brand);
                    } else {
                        product.brand = updatedbrand;
                        // product.mediaURL = updatedMedia;
                        product.media = null;
                        product.cost_price = updatedcost_price;
                        product.selling_price = updatedselling_price;
                        product.size = updatedsize;
                        product.category = updatedcategory;
                        product.sub_cat = updatedsub_cat;
                        product.qty += updatedqty;
                        product.description = updatedDescription;
                        await product.save();
                    }
                    console.log("Updated Product");
                    // return res.redirect("/admin/products");
                });
                return res.redirect("/admin/products");
            } else {
                console.log("Not excel file...");
                res.redirect("/admin/products");
            }
        } catch (e) {
            console.log(e.message);
            res.redirect("/admin/products");
        }
    },

    getCreateUserController: async(req, res) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render("admin/createUser", {
            pageTitle: "Create User",
            path: "createUser",
            errorMessage: message,
            role: null,
        });
    },

    postCreateUserController: async(req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const physicalAddress = req.body.physicalAddress;
        const gender = req.body.gender;
        const role = req.body.role;

        User.findOne({ email: email })
            .then((emailExists) => {
                if (emailExists) {
                    req.flash("error", "email already exists, try another?");
                    return res.redirect("/admin/createUser");
                }
                return bcrypt
                    .hash(password, 12)
                    .then((hashedPassword) => {
                        const user = new User({
                            username: username,
                            email: email,
                            password: hashedPassword,
                            physicalAddress: physicalAddress,
                            gender: gender,
                            role: role,
                            cart: { items: [] },
                        });
                        return user.save();
                    })
                    .then((result) => {
                        res.redirect("/admin/users");
                    });
            })
            .catch((err) => {
                console.log(err, "postCreateUserController");
            });
    },

    // get categories 
    getCategoriesController: async(req, res, next) => {
        const categories = await categoryModel.find();

        res.render("admin/categories", {
            pageTitle: "All Categories",
            path: "dashboard",
            editing: false,
            role: req.user.role,
            categories,
        });
    },

    // get create category
    getCreateCategoryController: async(req, res) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        console.log("🚀 ~ file: admin.controller.js:564 ~ getCreateCategoryController:async ~ message:", message)
        res.render("admin/add_category", {
            pageTitle: "Create Category",
            path: "dashboard",
            errorMessage: message,
            role: null,
        });
    },

    // post create category
    postCreateCategoryController: async(req, res) => {
        try {
            const { category } = req.body;
            const categorySmall = category.toLowerCase();

            // check for match
            const fetchCategory = await categoryModel.findOne({ category: categorySmall })
            if (fetchCategory) {
                return res.status(400).send("Category already exists")
            }

            const newCategory = new categoryModel({
                categorySmall
            })
            await newCategory.save();
            console.log("🚀 ~ file: admin.controller.js:582 ~ postCreateCategoryController:async ~ newCategory:", newCategory)

            res.redirect("/admin/categories");
        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:698 ~ postCreateCategoryController:async ~ error:", error)
            return res.status(400).send("Couldn't create category")
        }
    },

    // get Edit category
    getEditCategoryController: async(req, res) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const { id } = req.query;

        // check for match
        const category = await categoryModel.findOne({ _id: id })

        res.render("admin/edit_category", {
            pageTitle: "Edit Category",
            path: "dashboard",
            errorMessage: message,
            role: null,
            category,
        });
    },

    // post Edit category
    postEditCategoryController: async(req, res) => {
        try {
            const { category } = req.body;
            const categorySmall = category.toLowerCase();

            const { categoryId } = req.query;
            console.log("🚀 ~ file: admin.controller.js:717 ~ postEditCategoryController:async ~ categoryId:", categoryId)

            // check for match
            const getCategory = await categoryModel.findOne({ _id: categoryId })

            if (!getCategory) {
                return res.status(400).send("Category does not exist")
            }

            getCategory.category = categorySmall;
            await getCategory.save();
            console.log("🚀 ~ file: admin.controller.js:727 ~ postEditCategoryController:async ~ getCategory:", getCategory)

            res.redirect("/admin/categories");
        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:698 ~ postCreateCategoryController:async ~ error:", error)
            return res.status(400).send("Couldn't create category")
        }
    },

    // get sub categories 
    getSubCategoriesController: async(req, res, next) => {

        const { id } = req.query;

        const sub_cats = await sub_catModel.find({ categoryId: id });

        res.render("admin/sub_cats", {
            pageTitle: "Subcategories",
            path: "dashboard",
            editing: false,
            role: req.user.role,
            sub_cats,
            categoryId: id,
        });
    },


    // get create sub category
    getCreateSubCategoryController: async(req, res) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const { categoryId } = req.query;
        res.render("admin/add_sub_cat", {
            pageTitle: "Create Sub Category",
            path: "dashboard",
            errorMessage: message,
            role: null,
            categoryId,
        });
    },

    // post create sub category
    postCreateSubCategoryController: async(req, res) => {
        try {
            const { sub_cat } = req.body;
            const { categoryId } = req.query;
            console.log("categoryId:", categoryId)
            const sub_catSmall = sub_cat.toLowerCase();

            // check for match
            const fetchSubCategory = await sub_catModel.findOne({ sub_cat: sub_catSmall, categoryId: categoryId })
            if (fetchSubCategory) {
                return res.status(400).send("Sub Category already exists")
            }

            const subCategory = new sub_catModel({
                categoryId: categoryId,
                sub_cat: sub_catSmall
            })
            await subCategory.save();
            console.log("🚀 ~ file: admin.controller.js:582 ~ postCreateCategoryController:async ~ subCategory:", subCategory)

            res.redirect("/admin/categories");
        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:743 ~ postCreateSubCategoryController:async ~ error:", error)
            return res.status(400).send("Couldn't create sub category")
        }
    },


    // get Edit Sub category
    getEditSubCategoryController: async(req, res) => {
        let message = req.flash("error");
        //so the error message box will not always be active
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        const { categoryId, sub_catId } = req.query;
        console.log("req.query:", req.query)

        // check for match
        const sub_cat = await sub_catModel.findOne({ _id: sub_catId })

        res.render("admin/edit_sub_cat", {
            pageTitle: "Edit Category",
            path: "dashboard",
            errorMessage: message,
            role: null,
            categoryId,
            sub_cat,
        });
    },

    // post Edit Sub category
    postEditSubCategoryController: async(req, res) => {
        try {
            const { sub_cat } = req.body;
            console.log("req.body: ", req.body)
            const sub_catSmall = sub_cat.toLowerCase();

            const { categoryId, sub_catId } = req.query;

            // check for match
            const getSubCategory = await sub_catModel.findOne({ _id: sub_catId })
            console.log("getSubCategory: ", getSubCategory)

            if (!getSubCategory) {
                return res.status(400).send("Sub Category does not exist")
            }

            getSubCategory.sub_Cat = sub_catSmall;
            await getSubCategory.save();

            res.redirect("/admin/categories");
        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:852 ~ postEditSubCategoryController:async ~ error:", error)
            return res.status(400).send("Couldn't create category")
        }
    },

};