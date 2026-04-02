const pool = require("../database/")

async function registerAccount(first, last, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    return await pool.query(sql, [first, last, email, password])
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount }