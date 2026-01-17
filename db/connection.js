const mysql = require("mysql2");
require("dotenv").config(); // .env dosyasındaki verileri okumak için eklendi

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kds",
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Bağlantı Hatası:", err);
    } else {
        console.log("MySQL Bağlantısı Başarılı!");
    }
});

module.exports = db;
