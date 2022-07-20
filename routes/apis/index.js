const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

// Admin
router.use('/admin', admin)

// Restaurant
router.get('/restaurants', restController.getRestaurants)

// Error handler
router.use('/', apiErrorHandler)

module.exports = router
