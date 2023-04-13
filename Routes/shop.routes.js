const express = require("express");
const shopController = require("../Controller/shop.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const { authorize } = require("../Middlewares/roleCheck");

const router = express.Router();

router.get("/", shopController.getIndexController);

router.get("/products", shopController.getProductController);

router.post("/productsSort",  authorize('cashier'), shopController.postSortProductsController);

router.get("/products/:productId",   shopController.getProductByIdController);

router.get("/cart", isAuthenticated,  authorize('cashier'), shopController.getcartController);

router.post("/cart", isAuthenticated,  authorize('cashier'), shopController.postCartController);

router.post("/cart_delete_item", isAuthenticated,  authorize('cashier'), shopController.postCartDeleteProductController);

router.get("/orders", isAuthenticated,  authorize('cashier'), shopController.getOrdersController);

router.post("/orders", isAuthenticated,  authorize('cashier'), shopController.getOrdersController);

router.post('/create_order', isAuthenticated,  authorize('cashier'), shopController.postOrderController);

router.get("/invoice/:id", isAuthenticated,  authorize('cashier'), shopController.getInvoiceController);

router.get("/receipt/:id", isAuthenticated,  authorize('cashier', 'admin'), shopController.getReceiptController);

router.get("/checkout/:id",  authorize('cashier'), shopController.getcheckoutController);

router.post("/checkout/:id", authorize('cashier'), shopController.postCheckoutController);


module.exports = router;
