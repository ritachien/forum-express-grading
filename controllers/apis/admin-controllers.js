const adminServices = require('../../services/admin-services')

// Controller
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants((err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = adminController
