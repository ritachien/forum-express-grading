const { Restaurant, Category, Comment, User } = require('../../models')
const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'createdAt', 'DESC']],
        nest: true
      })
      if (!restaurant) throw new Error('Restaurant does not exist!')

      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)

      await restaurant.increment('view_counts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) { next(err) }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' }
        ]
      })

      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) { next(err) }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [resData, comData] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant],
          raw: true,
          nest: true
        })
      ])

      const restaurants = resData.map(res => ({
        ...res,
        description: res.description.substring(0, 70) + ' ...'
      }))
      const comments = comData.map(com => ({
        ...com,
        text: com.text.substring(0, 70) + ' ...'
      }))

      res.render('feeds', { restaurants, comments })
    } catch (err) { next(err) }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const ranksLimit = 10
      const resData = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })

      const restaurants = resData
        .map(res => ({
          ...res.dataValues,
          description: res.description.substring(0, 80) + '...',
          favoritedCount: res.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(r => r.id === res.id)
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, ranksLimit)

      return res.render('top-restaurants', { restaurants })
    } catch (err) { next(err) }
  }
}

module.exports = restaurantController
