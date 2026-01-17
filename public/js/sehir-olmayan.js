// ------------------------------------------------------
// SAYFA YÜKLENDİĞİNDE ÇALIŞ
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadOlmayanSehirler();
});

let olmayanChartInstance = null;

// ------------------------------------------------------
// ŞUBESİ OLMAYAN ŞEHİRLERİ YÜKLE + TABLO + DONUT
// ------------------------------------------------------
async function loadOlmayanSehirler() {
    try {
        const res = await fetch("/api/sehir/olmayan");
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) return;

        // Skora göre sırala
        const sorted = [...data].sort((a, b) => b.skor - a.skor);

        // ------------------ TABLO ------------------
        const tbody = document.getElementById("olmayan-table-body");
        tbody.innerHTML = "";

        sorted.forEach((item, index) => {
            tbody.innerHTML += `
                <tr class="border-b border-slate-100 last:border-b-0">
                    <td class="py-2 pr-2">${index + 1}</td>
                    <td class="py-2 pr-2">${item.sehir}</td>
                    <td class="py-2 pl-2 text-right">${Number(item.skor).toFixed(4)}</td>
                </tr>
            `;
        });

        // ------------------ DONUT GRAFİĞİ ------------------
        const labels = sorted.map(x => x.sehir);
        const values = sorted.map(x => Number(x.skor));

        // Modern Marka Renk Seti (şehir sayısına göre otomatik)
        const modernColors = [
            "#4F9CF9", "#F25C54", "#FFC75F", "#36C98D",
            "#8A7FF0", "#4E596F", "#FF8FA3", "#2DD4BF"
        ];

        const ctx = document.getElementById("olmayan-chart").getContext("2d");

        // Eski grafik varsa yok et
        if (olmayanChartInstance) {
            olmayanChartInstance.destroy();
        }

        // Yeni grafik
        olmayanChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: modernColors.slice(0, values.length),
                    borderWidth: 0,         
                    hoverOffset: 14,         // Hover efekti — dilim dışarı çıkar
                    hoverBorderColor: "#ffffff",
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                // ----------- ANİMASYON -----------
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    easing: "easeOutQuart"
                },

                cutout: "60%",  // donut merkezi — diğer grafikle aynı görünüm

                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 12,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const label = ctx.label || "";
                                const value = ctx.parsed || 0;
                                return `${label}: ${value.toFixed(4)}`;
                            }
                        }
                    }
                }
            }
        });

    } catch (err) {
        console.error("Şubesi olmayan şehirler yüklenirken hata:", err);
    }
}
