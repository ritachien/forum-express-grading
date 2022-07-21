// Include modules
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { User, Restaurant } = require('../models')

// Set passport strategy
passport.use(new LocalStrategy(
  // Customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // Authenticate user
  async (req, email, password, cb) => {
    // Check if email already exists
    const user = await User.findOne({ where: { email: email.trim() } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

    // Check if password correct
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

    // Email and password correct
    return cb(null, user)
  }
))

// Set passportJWT
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) { cb(err) }
})

module.exports = passport
