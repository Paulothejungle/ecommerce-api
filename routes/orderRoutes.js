const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware');

router.route('/').get(authMiddleware, getUserOrders).post(authMiddleware, createOrder);

module.exports = router;

