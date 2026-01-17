// ------------------------------------------------------
// SAYFA YÜKLENDİĞİNDE ÇALIŞ
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const defaultLimit = 5;

    loadStats();
    loadKategoriChart(defaultLimit);
    loadBestProducts(defaultLimit);
    loadBestProductsChart(defaultLimit);
    loadYoY();

    // 🔥 SABİT → TÜM KATEGORİLER
    loadAylikKategoriChart();

    const limitSelect = document.getElementById("productLimit");
    if (limitSelect) {
        limitSelect.addEventListener("change", (e) => {
            const limit = Number(e.target.value);
            loadBestProducts(limit);
            loadBestProductsChart(limit);
            loadKategoriChart(limit);
        });
    }
});


// ------------------------------------------------------
// YILLIK DEĞİŞİM (YoY)
// ------------------------------------------------------
function loadYoY() {
    fetch("/api/dashboard/satis/yillik")
        .then(res => res.json())
        .then(data => {

            const thisYear = Number(data.thisYear) || 0;
            const lastYear = Number(data.lastYear) || 0;

            let yoy = lastYear > 0
                ? ((thisYear - lastYear) / lastYear) * 100
                : 0;

            const valueEl = document.getElementById("yoyValue");
            const iconEl = document.getElementById("yoyIcon");

            valueEl.textContent = yoy.toFixed(1) + "%";

            if (yoy >= 0) {
                iconEl.textContent = "▲";
                iconEl.className = "text-3xl font-bold text-green-600";
                valueEl.className = "text-3xl font-bold text-green-600";
            } else {
                iconEl.textContent = "▼";
                iconEl.className = "text-3xl font-bold text-red-600";
                valueEl.className = "text-3xl font-bold text-red-600";
            }
        });
}


// ------------------------------------------------------
// RANDOM RENK
// ------------------------------------------------------
function generateColors(count) {
    return Array.from({ length: count }, () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 55%)`;
    });
}


// ------------------------------------------------------
// ÜST KARTLAR
// ------------------------------------------------------
function loadStats() {
    fetch("/api/dashboard/stats")
        .then(res => res.json())
        .then(data => {
            document.getElementById("subeSayisi").textContent = data.sube_sayisi;
            document.getElementById("satisSayisi").textContent = data.satis_sayisi;
            document.getElementById("urunSayisi").textContent = data.urun_sayisi;
        });
}


// ------------------------------------------------------
// KATEGORİ SATIŞ BAR
// ------------------------------------------------------
let kategoriChart = null;

function loadKategoriChart(limit = 5) {
    fetch(`/api/dashboard/kategori-satis?limit=${limit}`)
        .then(res => res.json())
        .then(data => {

            if (kategoriChart) kategoriChart.destroy();

            kategoriChart = new Chart(
                document.getElementById("kategoriChart"),
                {
                    type: "bar",
                    data: {
                        labels: data.map(i => i.kategori),
                        datasets: [{
                            label: "Satış",
                            data: data.map(i => i.toplam_adet),
                            backgroundColor: "rgba(59,130,246,0.4)"
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } }
                    }
                }
            );
        });
}


// ------------------------------------------------------
// 🔥 AYLIK SATIŞ – TÜM KATEGORİLER AYNI GRAFİK
// ------------------------------------------------------
let aylikKategoriChart = null;

function loadAylikKategoriChart() {

    const months = [
        "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
        "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
    ];

    const kategoriler = ["Elbise", "Tişört", "Pantolon", "Mont"];

    const renkler = {
        Elbise: "#3b82f6",
        Tişört: "#22c55e",
        Pantolon: "#f97316",
        Mont: "#ef4444"
    };

    const requests = kategoriler.map(kat =>
        fetch(`/api/dashboard/aylik-satis-kategori?kategori=${kat}`)
            .then(res => res.json())
            .then(data => {
                const dizi = new Array(12).fill(0);
                data.forEach(i => dizi[i.ay - 1] = i.toplam_adet);

                return {
                    label: `${kat} Satışları`,
                    data: dizi,
                    borderColor: renkler[kat],
                    backgroundColor: renkler[kat] + "33",
                    borderWidth: 2,
                    tension: 0.35
                };
            })
    );

    Promise.all(requests).then(datasets => {

        if (aylikKategoriChart) aylikKategoriChart.destroy();

        aylikKategoriChart = new Chart(
            document.getElementById("aylikChart"),
            {
                type: "line",
                data: {
                    labels: months,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    }
                }
            }
        );
    });
}


// ------------------------------------------------------
// EN ÇOK SATAN ÜRÜNLER TABLO
// ------------------------------------------------------
function loadBestProducts(limit = 5) {
    fetch(`/api/dashboard/best-products?limit=${limit}`)
        .then(res => res.json())
        .then(data => {

            const tbody = document.getElementById("bestProductsBody");
            tbody.innerHTML = "";

            data.forEach(item => {
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="py-2">${item.urun_adi}</td>
                        <td class="py-2">${item.kategori}</td>
                        <td class="py-2 text-right">${item.toplam_adet}</td>
                        <td class="py-2 text-right">${Number(item.toplam_tutar).toFixed(2)} ₺</td>
                    </tr>
                `;
            });
        });
}


// ------------------------------------------------------
// DONUT – GELİR
// ------------------------------------------------------
const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart, args, options) {
        if (!options.total || !options.label) return;

        const { ctx } = chart;
        const { x, y } = chart.getDatasetMeta(0).data[0];

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText(options.total, x, y - 6);

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(options.label, x, y + 18);

        ctx.restore();
    }
};

let bestChart = null;

function loadBestProductsChart(limit = 5) {
    fetch(`/api/dashboard/best-products?limit=${limit}`)
        .then(res => res.json())
        .then(data => {

            if (bestChart) bestChart.destroy();

            const values = data.map(i => Number(i.toplam_tutar));
            const total = values.reduce((a, b) => a + b, 0)
                .toLocaleString("tr-TR") + " ₺";

            bestChart = new Chart(
                document.getElementById("bestProductsChart"),
                {
                    type: "doughnut",
                    data: {
                        labels: data.map(i => i.urun_adi),
                        datasets: [{
                            data: values,
                            backgroundColor: generateColors(values.length),
                            borderWidth: 2,
                            hoverOffset: 14
                        }]
                    },
                    options: {
                        responsive: true,
                        cutout: "68%",
                        plugins: {
                            legend: { position: "bottom" },
                            centerText: {
                                total: total,
                                label: "Toplam Gelir"
                            }
                        }
                    },
                    plugins: [centerTextPlugin]
                }
            );
        });
}
