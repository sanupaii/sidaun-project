/**
 * backend/middleware/authMiddleware.js
 * Middleware untuk memvalidasi JWT
 */
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1]

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_sidaun_key')

      // Dapatkan data pengguna dari token (tanpa password)
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error('Not authorized, token failed', error)
      res.status(401).json({ success: false, error: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' })
  }
}

module.exports = { protect }
