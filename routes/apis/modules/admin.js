const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controllers')

router.get('/restaurants', adminController.getRestaurants)

module.exports = router
