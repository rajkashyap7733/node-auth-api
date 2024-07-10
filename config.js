const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"Raj@7733",
    database:"newcurd"
})

module.exports = pool