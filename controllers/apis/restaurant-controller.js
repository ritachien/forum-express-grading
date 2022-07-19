const { Restaurant, Category } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || ''

      const [resData, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
      const LikedRestaurantId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []

      const restaurants = resData.rows.map(res => ({
        ...res,
        description: res.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(res.id),
        isLiked: LikedRestaurantId.includes(res.id)
      }))

      res.json({
        restaurants,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) { next(err) }
  }
}

module.exports = restaurantController
