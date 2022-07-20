const { Restaurant, Category } = require('../models')
// Options: localFileHandler, imgurFileHandler
const fileHandler = require('../helpers/file-helpers').imgurFileHandler

const adminServices = {
  getRestaurants: async (req, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return cb(null, { restaurants })
    } catch (err) { cb(err) }
  },
  postRestaurant: async (req, cb) => {
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name.trim()) throw new Error('Restaurant name is required!')

      // Create new restaurant
      const { file } = req // Get image file
      const filePath = await fileHandler(file)
      const newRestaurant = await Restaurant.create({
        name: name.trim(),
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })

      return cb(null, { restaurant: newRestaurant })
    } catch (err) { cb(err) }
  },
  deleteRestaurant: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error('Restaurant did not exist!')
      const deletedRestaurant = await restaurant.destroy()
      return cb(null, { restaurant: deletedRestaurant })
    } catch (err) { cb(err) }
  }
}

module.exports = adminServices
