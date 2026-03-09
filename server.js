const express = require("express")
require("dotenv").config()

const app = express()

/* Static files */
app.use(express.static("public"))

/* View engine */
const expressLayouts = require("express-ejs-layouts")

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* Routes */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* Server */
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})