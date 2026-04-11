const pool = require("../database/")

async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

async function getInventoryByClassificationId(classificationId) {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory WHERE classification_id = $1",
      [classificationId]
    )
    return result.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *
    `
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM classification ORDER BY classification_name"
    )
    return data
  } catch (error) {
    console.error("getClassifications error " + error)
  }
}

async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `

    return await pool.query(sql, [
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
    ])
  } catch (error) {
    return error.message
  }
}


async function checkExistingVehicle(inv_make, inv_model) {
  try {
    const sql = `
      SELECT * FROM inventory 
      WHERE inv_make = $1 AND inv_model = $2
    `
    const result = await pool.query(sql, [inv_make, inv_model])
    return result.rows[0]
  } catch (error) {
    console.error("checkExistingVehicle error " + error)
  }
}
async function addInventoryWithQuantity(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `

    return await pool.query(sql, [
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
    ])
  } catch (error) {
    return error.message
  }
}
async function updateVehicleQuantity(inv_id, quantity) {
  try {
    const sql = `
      UPDATE inventory
      SET quantity = quantity + $1
      WHERE inv_id = $2
      RETURNING *
    `
    return await pool.query(sql, [quantity, inv_id])
  } catch (error) {
    console.error("updateVehicleQuantity error " + error)
  }
}

module.exports = { 
  getInventoryById,
  getInventoryByClassificationId,
  addClassification,
  getClassifications,
  addInventory,
  checkExistingVehicle,
  addInventoryWithQuantity,
  updateVehicleQuantity
}