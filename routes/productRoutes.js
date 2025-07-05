const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// route public
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

// route access token jwt
router.route('/').post(authMiddleware, createProduct);
router.route('/:id').put(authMiddleware, updateProduct).delete(authMiddleware, deleteProduct);

module.exports = router;

