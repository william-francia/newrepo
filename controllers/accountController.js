const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwtUtil = require("../utilities/jwt")

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

async function accountLogin(req, res) {
  let nav = await utilities.getNav()

  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid email or password")
    return res.render("account/login", {
      title: "Login",
      nav
    })
  }

  const validPassword = await bcrypt.compare(
    account_password,
    accountData.account_password
  )

  if (!validPassword) {
    req.flash("notice", "Invalid email or password")
    return res.render("account/login", {
      title: "Login",
      nav
    })
  }
  delete accountData.account_password
  //  JWT
  const payload = {
    account_id: accountData.account_id,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
    account_firstname: accountData.account_firstname
  }

  console.log("PASÓ LOGIN")

  const token = jwtUtil.generateToken(payload)

  //  COOKIE
  if (process.env.NODE_ENV === "development") {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3600000
  })
} else {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000
  })
}

  req.flash("notice", "Login successful")

  return res.redirect("/account/")
}

function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "Logged out successfully")
  res.redirect("/")
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

const hashedPassword = await bcrypt.hash(account_password, 10)

const result = await accountModel.registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  hashedPassword
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
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()

  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null
  })
}
async function buildAccount(req, res) {
  let nav = await utilities.getNav()

  res.render("account/index", {
    title: "My Account",
    nav,
    accountData: res.locals.accountData
  })
}



async function buildUpdateView(req, res) {
  const account_id = req.params.account_id
  const nav = await utilities.getNav()

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}



async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const existingEmail = await accountModel.checkExistingEmail(account_email, account_id)

  if (existingEmail) {
    req.flash("notice", "Email already exists.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email
      },
      errors: null
    })
  }
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/index", {
      title: "My Account",
      nav,
      accountData,
      errors: null
    })
  } else {
    req.flash("notice", "Update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email
      }
    })
  }
}


async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

if (!account_password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{12,}/)) {
  req.flash("notice", "Password does not meet requirements.")

  const accountData = await accountModel.getAccountById(account_id)

  return res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    errors: null
  })
}
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")

      const accountData = await accountModel.getAccountById(account_id)

      return res.render("account/index", {
        title: "My Account",
        nav,
        accountData,
        errors: null
      })
    } else {
      req.flash("notice", "Password update failed.")

      const accountData = await accountModel.getAccountById(account_id)

      return res.render("account/update", {
        title: "Update Account",
        nav,
        accountData,
        errors: null
      })
    }
  } catch (error) {
    throw new Error("Password update error")
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logout,
  buildAccountManagement,
  buildAccount,
  buildUpdateView,
  updateAccount,
  updatePassword
}