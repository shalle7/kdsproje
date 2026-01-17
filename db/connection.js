const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kds"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Bağlantı Hatası:", err);
    } else {
        console.log("MySQL Bağlantısı Başarılı!");
    }
});

module.exports = db;
