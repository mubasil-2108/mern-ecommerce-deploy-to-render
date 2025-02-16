
const express = require('express');

const {getAllOrdersOfAllUsers, getOrdersDetailsForAdmin, updateOrderStatus} = require('../../../controllers/admin/ordersController');

const router = express.Router();

router.get('/get', getAllOrdersOfAllUsers);
router.get('/details/:id', getOrdersDetailsForAdmin);
router.put('/update/:id', updateOrderStatus);

module.exports = router;