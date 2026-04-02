const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/login", {
    title: "Login",
    nav,
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}


/* ****************************************
* *************************************** */

async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  const result = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (result) {
    req.flash("notice", `Registered! Welcome ${account_firstname}`)

    res.render("account/login", {
      title: "Login",
      nav
    })
  } else {
    req.flash("error", "Registration failed")

    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
}