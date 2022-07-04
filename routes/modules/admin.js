// FilePath: routes/modules/admin.js
// Include modules
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// Router settings
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
