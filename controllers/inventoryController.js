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


// ==============================
// BULK INVENTORY (NEW FEATURE)
// ==============================

invController.showBulkUpload = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/bulk-upload", {
  title: "Bulk Inventory Upload",
  nav,
  errors: null,
  successCount: null 
})
}


invController.processBulkUpload = async function (req, res) {
  let nav = await utilities.getNav()

  try {
    const { bulkData } = req.body

    if (!bulkData) {
      return res.render("inventory/bulk-upload", {
        title: "Bulk Inventory Upload",
        nav,
        errors: [{ msg: "Please enter data" }]
      })
    }

const lines = bulkData.split("\n")

let errors = []
let successCount = 0

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim()

  if (!line) continue

  const parts = line.split(",")

  if (parts.length !== 4) {
    errors.push(`Line ${i + 1}: Invalid format`)
    continue
  }

  const inv_make = parts[0].trim()
  const inv_model = parts[1].trim()
  const inv_price = parseFloat(parts[2].trim())
  const quantity = parseInt(parts[3].trim())

  if (!inv_make || !inv_model) {
    errors.push(`Line ${i + 1}: Missing make or model`)
    continue
  }

  if (isNaN(inv_price) || inv_price <= 0) {
    errors.push(`Line ${i + 1}: Invalid price`)
    continue
  }

  if (isNaN(quantity) || quantity <= 0) {
    errors.push(`Line ${i + 1}: Invalid quantity`)
    continue
  }

  const inv_description = "Bulk added vehicle"
  const inv_image = "/images/vehicles/no-image.png"
  const inv_thumbnail = "/images/vehicles/no-image.png"
  const inv_year = "2024"
  const inv_miles = 0
  const inv_color = "Unknown"
  const classification_id = 1

  try {
    const existing = await invModel.checkExistingVehicle(inv_make, inv_model)

    if (existing) {
      await invModel.updateVehicleQuantity(existing.inv_id, quantity)
    } else {
      await invModel.addInventoryWithQuantity(
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        quantity
      )
    }

    successCount++

  } catch (err) {
    errors.push(`Line ${i + 1}: DB error`)
  }
}

   if (errors.length > 0) {
  return res.render("inventory/bulk-upload", {
    title: "Bulk Inventory Upload",
    nav,
    errors: errors,
    successCount
  })
}

req.flash("notice", `${successCount} items processed successfully`)

res.render("inventory/management", {
  title: "Inventory Management",
  nav
})

  } catch (error) {
    console.error("processBulkUpload error: " + error)

    res.render("inventory/bulk-upload", {
      title: "Bulk Inventory Upload",
      nav,
      errors: [{ msg: "Error processing data" }]
    })
  }
}
module.exports = invController
