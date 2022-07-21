const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

// Admin
router.use('/admin', admin)

// User
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// Restaurant
router.get('/restaurants', restController.getRestaurants)

// Error handler
router.use('/', apiErrorHandler)

module.exports = router
