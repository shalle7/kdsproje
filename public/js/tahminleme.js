// ------------------------------------------------------------------
// GLOBAL SABİTLER
// ------------------------------------------------------------------
let satışChart = null;

const AY_ISIMLERI = [
    "Ocak","Şubat","Mart","Nisan",
    "Mayıs","Haziran","Temmuz","Ağustos",
    "Eylül","Ekim","Kasım","Aralık"
];

// ŞEHİR SEZON PROFİLLERİ
const SEHIR_SEZON_PROFILLERI = {
    "İstanbul": [1.02,0.98,0.97,1.00,1.05,1.12,1.10,1.03,1.04,1.06,1.08,1.10],
    "Antalya":  [0.80,0.75,0.80,0.90,1.10,1.35,1.45,1.35,1.15,1.00,0.85,0.80],
    "Erzurum":  [1.25,1.30,1.20,1.05,0.90,0.70,0.60,0.65,0.80,0.95,1.05,1.15]
};

const DEFAULT_SEZON = [
    1.00,0.96,0.95,0.99,
    1.05,1.12,1.10,1.02,
    1.03,1.05,1.07,1.08
];

// ------------------------------------------------------------------
function pazarBuyuklugu(ilceSayisi) {
    if (ilceSayisi >= 12) return 1.20;
    if (ilceSayisi >= 8)  return 1.05;
    return 0.90;
}

// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadSehirler();
});

// ------------------------------------------------------------------
async function loadSehirler() {
    const res = await fetch("/api/sehir/list");
    const data = await res.json();

    const select = document.getElementById("sehirSelect");
    select.innerHTML = `<option value="">Şehir seçiniz</option>`;

    data.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.sehir}</option>`;
    });
}

// ------------------------------------------------------------------
async function hesapla2026() {

    const sehirId = document.getElementById("sehirSelect").value;
    const yuzdeEtki = Number(document.getElementById("senaryoYuzde").value) / 100;

    if (!sehirId) {
        alert("Lütfen bir şehir seçin.");
        return;
    }

    const sehirAdi = document.querySelector(
        `#sehirSelect option[value="${sehirId}"]`
    ).textContent;

    const r = await fetch(`/api/ilce/topsis-ilce/${sehirId}`);
    const ilceler = await r.json();

    if (!ilceler.length) {
        alert("Bu şehrin ilçe verileri bulunamadı!");
        return;
    }

    // -------------------------------
    // 1️⃣ 2025 baz satış
    // -------------------------------
    const toplamSkor = ilceler.reduce((a, b) => a + b.skor, 0);
    const buyuklukFaktor = pazarBuyuklugu(ilceler.length);

    const tahmini2025Yillik =
        Math.round(toplamSkor * 150 * buyuklukFaktor);

    const aylik2025 = [
        0.09,0.07,0.06,0.07,
        0.08,0.10,0.09,0.07,
        0.08,0.09,0.10,0.10
    ].map(o => Math.round(o * tahmini2025Yillik));

    // -------------------------------
    // 2️⃣ 2026 tahmin
    // -------------------------------
    const sezon = SEHIR_SEZON_PROFILLERI[sehirAdi] || DEFAULT_SEZON;
    const toplamSenaryoFaktor = 1 + yuzdeEtki;

    const aylik2026 = aylik2025.map((v, i) => {
        let sonuc = v;
        sonuc *= sezon[i];
        sonuc *= toplamSenaryoFaktor;

        const oynaklik = (1 / buyuklukFaktor) * 0.10;
        sonuc *= (1 + (Math.random() * oynaklik * 2 - oynaklik));

        return Math.round(sonuc);
    });

    // -------------------------------
    // 3️⃣ 🔥 SAĞ KARTLAR (EKSİK OLAN KISIM)
    // -------------------------------
    const toplam2026 = aylik2026.reduce((a, b) => a + b, 0);

    document.getElementById("adetValue").innerText =
        toplam2026.toLocaleString("tr-TR");

    document.getElementById("gelirValue").innerText =
        (toplam2026 * 350).toLocaleString("tr-TR") + " ₺";

    document.getElementById("stokValue").innerText =
        Math.round(Math.max(...aylik2026) * 1.2);

    // -------------------------------
    // 4️⃣ Tablo + Grafik
    // -------------------------------
    fillOranTable(aylik2025, aylik2026);
    draw2026Grafik(aylik2025, aylik2026);
}

// ------------------------------------------------------------------
function fillOranTable(ay2025, ay2026) {

    const table = document.getElementById("oranTable");
    table.innerHTML = `
        <tr class="bg-gray-100">
            <th class="p-2">Ay</th>
            <th class="p-2">% Değişim</th>
        </tr>
    `;

    for (let i = 0; i < 12; i++) {
        const onceki = ay2025[i];
        const yeni = ay2026[i];
        const degisim = onceki ? ((yeni - onceki) / onceki) * 100 : 0;

        table.innerHTML += `
            <tr>
                <td class="p-2 border">${AY_ISIMLERI[i]}</td>
                <td class="p-2 border">${degisim.toFixed(1)}%</td>
            </tr>
        `;
    }
}

// ------------------------------------------------------------------
// 🌤️ LIGHT & OKUNAKLI GRAFİK
// ------------------------------------------------------------------
function draw2026Grafik(ay2025, ay2026) {

    if (satışChart) satışChart.destroy();

    const ctx =
        document.getElementById("satışTahminGrafik").getContext("2d");

    satışChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: AY_ISIMLERI,
            datasets: [
                {
                    label: "2025 Aylık Satış",
                    data: ay2025,
                    borderColor: "#4b5563",
                    backgroundColor: "rgba(75,85,99,0.12)",
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: "2026 Aylık Tahmin",
                    data: ay2026,
                    borderColor: "#0284c7",
                    backgroundColor: "rgba(2,132,199,0.25)",
                    borderWidth: 3,
                    tension: 0.45,
                    pointRadius: 5,
                    pointBackgroundColor: "#0284c7"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#111827",
                        font: { size: 13 }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#111827" },
                    grid: { color: "#e5e7eb" }
                },
                y: {
                    ticks: { color: "#111827" },
                    grid: { color: "#e5e7eb" }
                }
            }
        }
    });
}
