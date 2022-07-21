const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

// Admin
router.use('/admin', authenticated, authenticatedAdmin, admin)

// Restaurant
router.get('/restaurants', authenticated, restController.getRestaurants)

// User
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

// Error handler
router.use('/', apiErrorHandler)

module.exports = router
