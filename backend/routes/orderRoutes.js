const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

router.get('/', controller.listOrdersPage);

// API
router.post('/api', controller.createOrder);
router.get('/api', controller.apiListOrders);

module.exports = router;
