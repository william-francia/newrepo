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


module.exports = { 
  getInventoryById,
  getInventoryByClassificationId
}