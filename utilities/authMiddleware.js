const jwtUtil = require("./jwt")

const auth = {}

auth.checkLogin = function (req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    return res.redirect("/account/login")
  }

  const decoded = jwtUtil.verifyToken(token)

  if (!decoded) {
    return res.redirect("/account/login")
  }

  req.user = decoded
  next()
}

module.exports = auth