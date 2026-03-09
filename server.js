/* ******************************************
 * Primary server file
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * View Engine
 *************************/
const expressLayouts = require("express-ejs-layouts")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static")
app.use(staticRoutes)

// Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Local Server Information
 *************************/
const PORT = process.env.PORT || 3000

/* ***********************
 * Start Server
 *************************/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
