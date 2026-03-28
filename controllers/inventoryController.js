const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invController = {}

invController.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id

  const data = await invModel.getInventoryById(inv_id)

  if (!data) {
    return next({
      status: 404,
      message: "Vehicle not found"
    })
  }

  const nav = await utilities.getNav()

  const vehicleHTML = utilities.buildVehicleDetail(data)

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleHTML,
  })
}


invController.buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classificationId)

  if (!data || data.length === 0) {
    return next({
      status: 404,
      message: "No vehicles found"
    })
  }

  const nav = await utilities.getNav()

  res.render("inventory/classification", {
    title: "Vehicle",
    nav,
    data,
  })
}
invController.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error")
}
module.exports = invController