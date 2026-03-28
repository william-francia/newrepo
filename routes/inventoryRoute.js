const express = require("express")
const router = new express.Router()

const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")

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

module.exports = router