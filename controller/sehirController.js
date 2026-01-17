// controller/sehirController.js
const db = require("../db/connection");

/* ============================================================
   1) ŞEHİR LİSTESİ
   GET /api/sehirler
   ============================================================ */
exports.getSehirler = (req, res) => {
    const sql = `
        SELECT id, sehir, nufus, gelir, kira, ulasim, rakip
        FROM sehirler
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Şehirler sorgu hatası:", err);
            return res.status(500).json({ error: "Veri okunamadı" });
        }
        res.json(rows);
    });
};


/* ============================================================
   2) ŞEHİR TOPSIS ANALİZİ
   GET /api/topsis-sehir
   ============================================================ */
exports.getSehirTopsis = (req, res) => {
    const sql = `
        SELECT id, sehir, nufus, gelir, kira, ulasim, rakip
        FROM sehirler
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Şehir TOPSIS sorgu hatası:", err);
            return res.status(500).json({ error: "Veri okunamadı" });
        }

        if (!rows.length) return res.json([]);

        /* ---------------------------------------------
           1) KRİTERLER ve TÜRLERİ
        --------------------------------------------- */
        const kriterler = ["nufus", "gelir", "kira", "ulasim", "rakip"];

        const benefit = ["nufus", "gelir", "ulasim"]; // yüksek iyi
        const cost = ["kira", "rakip"];              // düşük iyi

        // eşit ağırlıklar
        const w = {};
        const weight = 1 / kriterler.length;
        kriterler.forEach(k => (w[k] = weight));


        /* ---------------------------------------------
           2) NORMALİZE MATRİS
        --------------------------------------------- */
        const denom = {};
        kriterler.forEach(k => {
            let sumSq = 0;
            rows.forEach(r => {
                const v = Number(r[k]) || 0;
                sumSq += v * v;
            });
            denom[k] = Math.sqrt(sumSq) || 1;
        });

        const normalized = rows.map(r => {
            const obj = { ...r };
            kriterler.forEach(k => {
                obj[k] = (Number(r[k]) || 0) / denom[k];
            });
            return obj;
        });


        /* ---------------------------------------------
           3) AĞIRLIKLI NORMALİZE MATRİS (V)
        --------------------------------------------- */
        const weighted = normalized.map(r => {
            const obj = { ...r };
            kriterler.forEach(k => {
                obj[k] = obj[k] * w[k];
            });
            return obj;
        });


        /* ---------------------------------------------
           4) İDEAL EN İYİ (A+) - EN KÖTÜ (A-)
        --------------------------------------------- */
        const idealBest = {};
        const idealWorst = {};

        kriterler.forEach(k => {
            const vals = weighted.map(r => r[k]);

            if (benefit.includes(k)) {
                idealBest[k] = Math.max(...vals);
                idealWorst[k] = Math.min(...vals);
            } else {
                idealBest[k] = Math.min(...vals);
                idealWorst[k] = Math.max(...vals);
            }
        });


        /* ---------------------------------------------
           5) UZAKLIKLAR ve TOPSIS SKORU
        --------------------------------------------- */
        const result = weighted.map(r => {
            let dPlus = 0;
            let dMinus = 0;

            kriterler.forEach(k => {
                dPlus += Math.pow(r[k] - idealBest[k], 2);
                dMinus += Math.pow(r[k] - idealWorst[k], 2);
            });

            dPlus = Math.sqrt(dPlus);
            dMinus = Math.sqrt(dMinus);

            const skor = dMinus / ((dPlus + dMinus) || 1);

            return {
                id: r.id,
                sehir: r.sehir,
                skor: Number(skor.toFixed(6))
            };
        });

        // büyükten küçüğe sırala
        result.sort((a, b) => b.skor - a.skor);

        res.json(result);
    });
};
