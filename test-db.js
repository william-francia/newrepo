const pool = require("./database")

async function test() {
  const result = await pool.query("SELECT * FROM inventory")
  console.log(result.rows)
}

test()