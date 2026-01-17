const db = require("./db/connection");

// 12 Şehir – Dağılım oranına göre 216 ilçe
const SEHIRLER = [
    { id: 1, sehir: "İstanbul", ilceSayisi: 30, base: "buyuk" },
    { id: 2, sehir: "İzmir", ilceSayisi: 20, base: "buyuk" },
    { id: 3, sehir: "Ankara", ilceSayisi: 25, base: "buyuk" },
    { id: 4, sehir: "Antalya", ilceSayisi: 18, base: "orta" },
    { id: 5, sehir: "Bursa", ilceSayisi: 15, base: "orta" },
    { id: 6, sehir: "Eskişehir", ilceSayisi: 10, base: "orta" },
    { id: 7, sehir: "Gaziantep", ilceSayisi: 12, base: "orta" },
    { id: 8, sehir: "Kayseri", ilceSayisi: 10, base: "kucuk" },
    { id: 9, sehir: "Mersin", ilceSayisi: 12, base: "orta" },
    { id: 10, sehir: "Trabzon", ilceSayisi: 12, base: "kucuk" },
    { id: 11, sehir: "Samsun", ilceSayisi: 12, base: "kucuk" },
    { id: 12, sehir: "Kahramanmaraş", ilceSayisi: 10, base: "kucuk" },
];

// İlçe adları (random seçilecek)
const ILCE_ADLARI = [
    "Merkez", "Yenişehir", "Bahçelievler", "Güzeltepe", "Fatih", "Yeşilpınar",
    "Kayabaşı", "Erenköy", "Ayazma", "Beştepe", "Yıldıztepe", "Atatepe",
    "Kurtuluş", "Güneştepe", "Çamlık", "Poyraz", "Barbaros", "Yıldırım",
    "Kocatepe", "Çınar", "Kavaklı", "Dumlupınar", "Harmantepe", "Yayla",
    "Aksu", "Selçuklu", "Demirkapı", "Yunus Emre", "Cumhuriyet", "Mevlana"
];

// Şehir tipine göre değer dağılımı
const MODEL = {
    buyuk: {
        nufus: [200000, 600000],
        gelir: [70, 95],
        kira: [60, 90],
        ulasim: [70, 95],
        rakip: [50, 90],
        guvenlik: [60, 85],
        egitim: [70, 95],
        saglik: [70, 95],
        ticaret: [70, 100],
        turizm: [40, 90],
        gelisme: [70, 95]
    },
    orta: {
        nufus: [80000, 250000],
        gelir: [55, 75],
        kira: [35, 55],
        ulasim: [50, 75],
        rakip: [25, 55],
        guvenlik: [60, 85],
        egitim: [60, 85],
        saglik: [60, 80],
        ticaret: [50, 80],
        turizm: [30, 70],
        gelisme: [55, 80]
    },
    kucuk: {
        nufus: [30000, 120000],
        gelir: [40, 60],
        kira: [20, 40],
        ulasim: [30, 55],
        rakip: [10, 35],
        guvenlik: [50, 80],
        egitim: [50, 75],
        saglik: [50, 75],
        ticaret: [40, 65],
        turizm: [20, 55],
        gelisme: [45, 70]
    }
};

function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedIlceler() {
    console.log("🟡 İlçeler temizleniyor...");
    await db.promise().query("DELETE FROM ilceler");

    console.log("🟢 Yeni ilçeler ekleniyor...");

    for (const sehir of SEHIRLER) {
        const model = MODEL[sehir.base];

        for (let i = 0; i < sehir.ilceSayisi; i++) {
            const ad = ILCE_ADLARI[r(0, ILCE_ADLARI.length - 1)] + " " + (i + 1);

            const values = {
                nufus: r(...model.nufus),
                gelir: r(...model.gelir),
                kira: r(...model.kira),
                ulasim: r(...model.ulasim),
                rakip: r(...model.rakip),
                guvenlik: r(...model.guvenlik),
                egitim: r(...model.egitim),
                saglik: r(...model.saglik),
                ticaret: r(...model.ticaret),
                turizm: r(...model.turizm),
                gelisme: r(...model.gelisme),
            };

            await db.promise().query(
                `INSERT INTO ilceler 
                (ilce, nufus, gelir, kira, ulasim, rakip, guvenlik, egitim, saglik, ticaret, turizm, gelisme, sehir, sehir_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ad,
                    values.nufus,
                    values.gelir,
                    values.kira,
                    values.ulasim,
                    values.rakip,
                    values.guvenlik,
                    values.egitim,
                    values.saglik,
                    values.ticaret,
                    values.turizm,
                    values.gelisme,
                    sehir.sehir,
                    sehir.id
                ]
            );
        }
    }

    console.log("🎉 216+ ilçe başarıyla oluşturuldu!");
    process.exit();
}

seedIlceler();
