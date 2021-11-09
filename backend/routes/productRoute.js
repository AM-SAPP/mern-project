const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetail } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route('/product')
    .get(getAllProducts);

router.route('/product/new')
    .post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

router.route('/product/:id')
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
    .get(getProductDetail);

module.exports = router;