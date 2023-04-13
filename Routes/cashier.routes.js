const express = require("express");
const path = require("path");
const cashierController = require("../Controller/cashier.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const { authorize } = require("../Middlewares/roleCheck");
const upload = require("../Middlewares/multer");
const uploadExcel = require("../Middlewares/uploadExcel");

const router = express.Router();

router.get("/orders", authorize("cashier"), cashierController.getOrderController);

router.post("/orders", authorize("cashier"), cashierController.postSearchOrdersController);

router.get("/viewOrder/:id", authorize("cashier"), cashierController.getViewOrderController);

router.post("/viewOrder", authorize("cashier"), cashierController.togglePaidController);

router.get("/dashboard", authorize("cashier"), cashierController.getDashboardController);

router.get("/pendingOrders", authorize("cashier"), cashierController.getPendingOrdersController);

router.post("/pendingOrders", authorize("cashier"), cashierController.postSearchOrdersController);

router.get("/confirmedOrders", authorize("cashier"), cashierController.getConfirmedOrdersController);

router.get("/findOrders", authorize("cashier"), cashierController.getFindOrderController);

router.get("/products", authorize("cashier"), cashierController.getProductController);

router.post("/productsSort", authorize('cashier'), cashierController.postSortProductsController);

router.post("/productsSubCatSort", authorize('cashier'), cashierController.postSortProductsBySubCatController);

router.get("/products/:productId", authorize('cashier'), cashierController.getProductByIdController);

router.get("/add_product", isAuthenticated, authorize('cashier'), cashierController.getAddProductController);

router.post("/add_product", upload.single('media'), isAuthenticated, authorize('cashier'), cashierController.postAddProductController);

router.get("/edit_product/:productId", isAuthenticated, authorize('cashier'), cashierController.getEditProductController);

router.post("/edit_product", upload.single('media'), isAuthenticated, authorize('cashier'), cashierController.postEditProductController);


module.exports = router;