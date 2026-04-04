const express = require("express")
const router = new express.Router()

const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildVehicleDetail)
)
router.get(
  "/classification/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router