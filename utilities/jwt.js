const jwt = require("jsonwebtoken")

const jwtUtil = {}

jwtUtil.generateToken = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  })
}

jwtUtil.verifyToken = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

module.exports = jwtUtil