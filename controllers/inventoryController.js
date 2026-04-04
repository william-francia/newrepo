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
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}
invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

invController.addClassification = async function (req, res) {
  let nav = await utilities.getNav()

  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully")

    res.render("inventory/management", {
      title: "Inventory Management",
      nav
    })
  } else {
    req.flash("notice", "Failed to add classification")

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}


invController.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
  title: "Add Inventory",
  nav,
  classificationList,
  errors: null,
  inv_make: "",
  inv_model: "",
  inv_description: "",
  inv_image: "",
  inv_thumbnail: "",
  inv_price: "",
  inv_year: "",
  inv_miles: "",
  inv_color: "",
  classification_id: ""
})
}



invController.addInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash("notice", "Vehicle added successfully")

    res.render("inventory/management", {
      title: "Inventory Management",
      nav
    })
  } else {
    req.flash("notice", "Failed to add vehicle")

    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null
    })
  }
}
module.exports = invController
