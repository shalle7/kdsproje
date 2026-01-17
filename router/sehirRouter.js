const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const topsis = require("../utils/topsis");

// TÜM ŞEHİRLERİ TOPSIS SKORU İLE BİRLİKTE GETİR
router.get("/list", (req, res) => {
    db.query("SELECT * FROM sehirler", (err, results) => {
        if (err) return res.json({ error: err });

        const skorlar = topsis(results);
        res.json(skorlar);
    });
});

module.exports = router;
