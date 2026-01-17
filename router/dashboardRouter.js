const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// --------------------------------------------------
// ÜST KARTLAR
// --------------------------------------------------
router.get("/stats", (req, res) => {
    const result = {};

    db.query("SELECT COUNT(*) AS sube FROM subeler", (err, r1) => {
        if (err) return res.status(500).json(err);
        result.sube_sayisi = r1[0].sube;

        db.query("SELECT COUNT(*) AS urun FROM urunler", (err, r2) => {
            if (err) return res.status(500).json(err);
            result.urun_sayisi = r2[0].urun;

            db.query("SELECT COUNT(*) AS satis FROM satislar", (err, r3) => {
                if (err) return res.status(500).json(err);
                result.satis_sayisi = r3[0].satis;

                return res.json(result);
            });
        });
    });
});


// --------------------------------------------------
// KATEGORİ SORUNU ÇÖZÜLDÜ — normalize etme
// --------------------------------------------------
function normalize(k) {
    return k.toLowerCase().trim();
}


// --------------------------------------------------
// AYLIK SATIŞ (KATEGORİ FİLTRELİ) — DÜZELTİLDİ
// --------------------------------------------------
router.get("/aylik-satis-kategori", (req, res) => {
    let kategori = req.query.kategori || "Hepsi";

    let sql = `
        SELECT MONTH(s.tarih) AS ay, SUM(s.adet) AS toplam_adet
        FROM satislar s
        JOIN urunler u ON u.id = s.urun_id
    `;

    let params = [];

    if (kategori !== "Hepsi") {
        sql += ` WHERE LOWER(u.kategori) = ? `;
        params.push(normalize(kategori));
    }

    sql += ` GROUP BY MONTH(s.tarih) ORDER BY ay `;

    db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


// --------------------------------------------------
// KATEGORİYE GÖRE SATIŞ GRAFİĞİ
// --------------------------------------------------
router.get("/kategori-satis", (req, res) => {
    const limit = Number(req.query.limit) || 5;

    const sql = `
        SELECT u.kategori, SUM(s.adet) AS toplam_adet
        FROM satislar s
        JOIN urunler u ON u.id = s.urun_id
        GROUP BY u.kategori
        ORDER BY toplam_adet DESC
        LIMIT ?
    `;

    db.query(sql, [limit], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


// --------------------------------------------------
// EN ÇOK SATAN ÜRÜNLER
// --------------------------------------------------
router.get("/best-products", (req, res) => {
    const limit = Number(req.query.limit) || 5;

    const sql = `
        SELECT 
            u.ad AS urun_adi,
            u.kategori,
            SUM(s.adet) AS toplam_adet,
            SUM(s.toplam_tutar) AS toplam_tutar
        FROM satislar s
        JOIN urunler u ON s.urun_id = u.id
        GROUP BY u.id
        ORDER BY toplam_adet DESC
        LIMIT ?
    `;

    db.query(sql, [limit], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


// --------------------------------------------------
// YILLIK SATIŞ KARŞILAŞTIRMASI
// --------------------------------------------------
router.get("/satis/yillik", (req, res) => {

    const sql = `
        SELECT 
            SUM(CASE WHEN YEAR(tarih) = YEAR(NOW()) THEN adet END) AS thisYear,
            SUM(CASE WHEN YEAR(tarih) = YEAR(NOW()) - 1 THEN adet END) AS lastYear
        FROM satislar;
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);

        res.json({
            thisYear: rows[0].thisYear || 0,
            lastYear: rows[0].lastYear || 0
        });
    });
});

module.exports = router;
