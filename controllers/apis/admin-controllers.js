const adminServices = require('../../services/admin-services')

// Controller
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants((err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  }
}

module.exports = adminController
