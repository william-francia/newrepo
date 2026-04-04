const express = require("express")
const path = require("path")
require("dotenv").config()
const session = require("express-session")
const pool = require("./database/")
const app = express()
const accountRoute = require("./routes/accountRoute")


app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')())

const utilities = require("./utilities")

app.use(async function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  res.locals.nav = await utilities.getNav()
  next()
})

/* View Engine*/
const expressLayouts = require("express-ejs-layouts")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts)
app.set("layout", "layouts/layout")

// HOME
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})
app.use("/account", accountRoute)
const staticRoutes = require("./routes/static")
app.use(staticRoutes)

const inventoryRoute = require("./routes/inventoryRoute")
app.use("/inv", inventoryRoute)

// 404 
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* Server */

const PORT = process.env.PORT || 5500

// ERROR HANDLER
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav: null
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



