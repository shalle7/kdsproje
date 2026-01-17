const db = require("../db/connection");
const topsisOnline = require("../utils/topsisOnline");

exports.getOlmayanSehirler = (req, res) => {
    const sql = `
        SELECT id, sehir, nufus, gelir, online_satis
        FROM sehirler
        WHERE sube_var = 0
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        const skorlu = topsisOnline(rows);
        res.json(skorlu);
    });
};
