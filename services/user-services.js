const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password, passwordCheck } = req.body

      // Check if input block remains blank or spaces
      if (!name.trim() || !email.trim() || !password.trim() || !passwordCheck.trim()) {
        throw new Error('All input block are required!')
      }

      // Check if password equals passwordCheck
      if (password !== passwordCheck) throw new Error('Passwords does not match Password Check!')

      // Check if email already signed up
      const userFound = await User.findOne({ where: { email } })
      if (userFound) throw new Error('Email already exists!')

      // Create new user
      const userData = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })

      // Format output data
      const user = userData.toJSON()
      delete user.password

      return cb(null, user)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
