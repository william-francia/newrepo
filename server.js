/* ******************************************
 * Primary server file
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()

const app = express()

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"))

/* ***********************
 * View Engine
 *************************/
const expressLayouts = require("express-ejs-layouts")

app.set("view engine", "ejs")
app.set("views", "./views")

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
const HOST = process.env.HOST || "0.0.0.0"

/* ***********************
 * Start Server
 *************************/
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
})