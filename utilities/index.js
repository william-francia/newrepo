const Util = {}
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* Middleware for handling errors */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

Util.getNav = async function () {
  let data = await invModel.getClassifications()

  let nav = '<nav id="navMotors"><ul class="ulMotorsNav">'

  nav += '<li><a href="/">Home</a></li>'

  data.rows.forEach(row => {
    nav += `
      <li>
        <a href="/inv/classification/${row.classification_id}">
          ${row.classification_name}
        </a>
      </li>
    `
  })

  nav += '</ul></nav>'

  return nav
}

/* Funtion to build HTML from vehículos*/
Util.buildVehicleDetail = function (data) {
  if (!data) return "<p>No vehicle data available</p>"

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      </div>

      <div class="vehicle-info">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Year:</strong> ${data.inv_year}</p>
        <p><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
      </div>
    </div>
  `
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()

  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`

    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected"
    }

    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"

  return classificationList
}

Util.checkJWTToken = (req, res, next) => {

  // 🔥 SIEMPRE definir primero
  res.locals.loggedin = 0

  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.JWT_SECRET,
      function (err, accountData) {

        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }

        // ✅ SI el token es válido
        res.locals.accountData = accountData
        res.locals.loggedin = 1

        next()
      }
    )
  } else {
    next()
  }
}
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}
/* ****************************************
 *  Check Employee or Admin
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
     res.locals.accountData.account_type === "Admin")
  ) {
    next()
  } else {
    req.flash("notice", "Access denied")
    return res.redirect("/account/login")
  }
}
module.exports = Util