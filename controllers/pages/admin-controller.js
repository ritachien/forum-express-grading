// FilePath: controllers/admin-controllers.js
// Include modules
const { Restaurant, User, Category } = require('../../models')
const adminServices = require('../../services/admin-services')
// Options: localFileHandler, imgurFileHandler
const fileHandler = require('../../helpers/file-helpers').imgurFileHandler
const SUPER_USER = 'root@example.com'

// Controller
const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('admin/users', { users, SUPER_USER })
    } catch (err) { next(err) }
  },
  patchUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not exists!')
      if (user.email === SUPER_USER) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) { next(err) }
  },
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/create-restaurant', { categories })
    } catch (err) { next(err) }
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      res.render('admin/restaurants', data)
    })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/restaurant', { restaurant })
    } catch (err) { next(err) }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, { raw: true }),
        Category.findAll({ raw: true })
      ])
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) { next(err) }
  },
  putRestaurant: async (req, res, next) => {
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name.trim()) throw new Error('Restaurant name is required!')

      // Update restaurant info
      const { file } = req
      const filePath = await fileHandler(file)
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (!restaurant) throw new Error('Restaurant did not exist!')
      await restaurant.update({
        name: name.trim(),
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image,
        categoryId
      })
      req.flash('success_messages', 'Restaurant was successfully updated')
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.redirect('/admin/restaurants', data))
  }
}

module.exports = adminController
