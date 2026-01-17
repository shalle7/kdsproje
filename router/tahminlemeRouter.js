const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------
// 1. Satış Tahmini Endpoint'i (Kısa Vade Tahmin)
// -------------------------------------------------------------------------
router.get('/satis-tahminle', (req, res) => {

    const aylik_satislar = [17, 10, 6]; // Ocak, Şubat, Mart
    const alpha = 0.2;

    let son_tahmin = aylik_satislar[0];

    for (let i = 1; i < aylik_satislar.length; i++) {
        son_tahmin = (alpha * aylik_satislar[i]) + ((1 - alpha) * son_tahmin);
    }

    const nisan_tahmini = son_tahmin;

    const ortalama_gelir = 11497 / 33;
    const tahmini_gelir = nisan_tahmini * ortalama_gelir;

    res.json({
        success: true,
        tahmin_ay: "Nisan",
        tahmin_adedi: Math.round(nisan_tahmini),
        tahmini_gelir: tahmini_gelir.toFixed(2) + " ₺",
        yöntem: "Basit Üstel Düzeltme (a=0.2)"
    });
});

// -------------------------------------------------------------------------
// 2. Şube Skor Tahmini Endpoint'i
// -------------------------------------------------------------------------
router.post('/skor-tahminle', (req, res) => {

    const { şehir, online_artış_yüzdesi, trafik_artış_yüzdesi } = req.body;

    if (şehir !== 'Kayseri') {
        return res.json({ success: false, message: "Lütfen Kayseri'yi seçerek deneyin." });
    }

    const mevcut_skor = 0.2534;
    const izmir_skoru = 0.2845;

    const online_etki = (online_artış_yüzdesi / 100) * 0.7;
    const trafik_etki = (trafik_artış_yüzdesi / 100) * 0.3;
    const toplam_etki = online_etki + trafik_etki;

    const yeni_skor = mevcut_skor * (1 + toplam_etki);
    const yeni_skor_f = yeni_skor.toFixed(4);

    let mesaj = `Tahmini yeni skor: ${yeni_skor_f}.`;

    if (yeni_skor > izmir_skoru) {
        mesaj += " İzmir skorunun üzerine çıkıyor!";
    } else {
        mesaj += ` İzmir skoru (${izmir_skoru}) için daha fazla artış gerekli.`;
    }

    res.json({
        success: true,
        şehir,
        eski_skor: mevcut_skor,
        yeni_skor: yeni_skor_f,
        sonuç: mesaj
    });
});

module.exports = router;
