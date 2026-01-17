// controller/ilceController.js
const db = require("../db/connection");
const topsisIlce = require("../utils/topsis_ilce"); // ✔ TOPSIS fonksiyonu


/* ============================================================
   1) TÜM İLÇELERİ GETİR
   GET /api/ilceler
   ============================================================ */
exports.getIlceler = (req, res) => {
    const sql = "SELECT * FROM ilceler";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("İlçeler sorgu hatası:", err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
};


/* ============================================================
   2) ŞEHRE GÖRE İLÇELER
   GET /api/ilceler/:sehirId
   ============================================================ */
exports.getIlcelerBySehir = (req, res) => {
    const sehirId = req.params.sehirId;

    const sql = "SELECT * FROM ilceler WHERE sehir_id = ?";

    db.query(sql, [sehirId], (err, results) => {
        if (err) {
            console.error("İlçeler (şehre göre) sorgu hatası:", err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
};


/* ============================================================
   3) TÜM İLÇELER İÇİN TOPSIS
   GET /api/topsis-ilce
   ============================================================ */
exports.getTopsisIlce = (req, res) => {
    const sql = "SELECT * FROM ilceler";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("İlçe TOPSIS sorgu hatası:", err);
            return res.status(500).json({ error: err });
        }

        const skorlar = topsisIlce(results);
        res.json(skorlar);
    });
};


/* ============================================================
   4) ŞEHRE GÖRE İLÇE TOPSIS
   GET /api/topsis-ilce/:sehirId
   ============================================================ */
exports.getTopsisIlceBySehir = (req, res) => {
    const sehirId = req.params.sehirId;

    const sql = "SELECT * FROM ilceler WHERE sehir_id = ?";

    db.query(sql, [sehirId], (err, results) => {
        if (err) {
            console.error("İlçe TOPSIS (şehre göre) sorgu hatası:", err);
            return res.status(500).json({ error: err });
        }

        const skorlar = topsisIlce(results);
        res.json(skorlar);
    });
};
