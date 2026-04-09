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
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error " + error)
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type
       FROM account WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No account found")
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3
       WHERE account_id = $4
       RETURNING *`,
      [firstname, lastname, email, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function updatePassword(account_id, password) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_password = $1
       WHERE account_id = $2
       RETURNING *`,
      [password, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}
async function checkExistingEmail(email, account_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM account 
       WHERE account_email = $1 
       AND account_id != $2`,
      [email, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}
module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  checkExistingEmail
}
