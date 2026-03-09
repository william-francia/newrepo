/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
app.use(express.static("public"))
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const PORT = process.env.PORT || 3000; // Usa 3000 si no hay PORT definido
const HOST = process.env.HOST || "0.0.0.0"; // 0.0.0.0 funciona en Rende

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(PORT, HOST, () => {
  console.log(`App listening on ${HOST}:${PORT}`);
});
