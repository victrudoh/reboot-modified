const express = require("express");
const path = require("path");
const adminController = require("../Controller/admin.controller");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const { authorize } = require("../Middlewares/roleCheck");
const upload = require("../Middlewares/multer");
const uploadExcel = require("../Middlewares/uploadExcel");

const router = express.Router();

// router.get("/login", adminController.loginController);

// router.get("/add_product", isAuthenticated, authorize('admin', 'cashier'), adminController.getAddProductController);
router.get("/add_product", isAuthenticated, authorize('admin'), adminController.getAddProductController);

// router.post("/add_product", upload.single('media'), isAuthenticated, authorize('admin', 'cashier'), adminController.postAddProductController);
router.post("/add_product", upload.single('media'), isAuthenticated, authorize('admin'), adminController.postAddProductController);

// router.get("/products", authorize('admin', 'cashier'), adminController.getProductController);
router.get("/products", authorize('admin'), adminController.getProductController);

// router.post("/productsSort", authorize('admin', 'cashier'), adminController.postSortProductsController);
router.post("/productsSort", authorize('admin'), adminController.postSortProductsController);

router.post("/productsSubCatSort", authorize('admin'), adminController.postSortProductsBySubCatController);

// router.get("/edit_product/:productId", isAuthenticated, authorize('admin', 'cashier'), adminController.getEditProductController);
router.get("/edit_product/:productId", isAuthenticated, authorize('admin'), adminController.getEditProductController);

// router.post("/edit_product", upload.single('media'), isAuthenticated, authorize('admin', 'cashier'), adminController.postEditProductController);
router.post("/edit_product", upload.single('media'), isAuthenticated, authorize('admin'), adminController.postEditProductController);

// router.post("/delete_product", isAuthenticated, authorize('admin', 'cashier'), adminController.postDeleteProductController);
router.post("/delete_product", isAuthenticated, authorize('admin'), adminController.postDeleteProductController);

// router.post("/disable_product", isAuthenticated, authorize('admin', 'cashier'), adminController.toggleDisableProductController);
router.post("/disable_product", isAuthenticated, authorize('admin'), adminController.toggleDisableProductController);

router.get("/dashboard", authorize('admin'), adminController.getDashboardController);

router.get("/orders", authorize('admin'), adminController.getOrdersController);

router.get("/ordersPayment", authorize('admin'), adminController.getOrdersPaymentController);

router.get("/ordersByCashier", authorize('admin'), adminController.getOrderByCashierController);

router.post("/ordersByCashier", authorize('admin'), adminController.postOrdersByCashier);

router.post("/orders", authorize('admin'), adminController.getOrdersController);

router.get("/users", authorize("admin"), adminController.getUsersController);

router.get("/edit_user/:id", authorize("admin"), adminController.postEditUserController);

router.post("/update_user", authorize("admin"), adminController.postUpdateUserController);

router.get("/out_of_stock", authorize("admin", "cashier"), adminController.getDisabledProductsController);

// router.post("/upload", upload.single('uploadFile'), authorize("admin, 'cashier'"), adminController.postUploadController);
router.post("/upload", upload.single('uploadFile'), authorize("admin"), adminController.postUploadController);

// router.post("/uploadExcel", uploadExcel.single('uploadExcel'), authorize("admin, 'cashier'"), adminController.postUploadExcelController);
router.post("/uploadExcel", uploadExcel.single('uploadExcel'), authorize("admin"), adminController.postUploadExcelController);

router.get("/createUser", authorize("admin"), adminController.getCreateUserController);

router.post("/createUser", authorize("admin"), adminController.postCreateUserController);

// categories
router.get("/categories", authorize("admin"), adminController.getCategoriesController);

router.get("/createCategory", authorize("admin"), adminController.getCreateCategoryController);

router.post("/createCategory", adminController.postCreateCategoryController);

router.get("/editCategory", authorize("admin"), adminController.getEditCategoryController);

router.post("/editCategory", adminController.postEditCategoryController);

// sub categories
router.get("/sub_cats", authorize("admin"), adminController.getSubCategoriesController);

router.get("/createSubCategory", authorize("admin"), adminController.getCreateSubCategoryController);

router.post("/createSubCategory", adminController.postCreateSubCategoryController);

router.get("/editSubCategory", authorize("admin"), adminController.getEditSubCategoryController);

router.post("/editSubCategory", adminController.postEditSubCategoryController);

module.exports = router;