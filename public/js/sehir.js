async function loadSehirSkor() {
    const res = await fetch("/api/sehir/list");
    const data = await res.json();

    const withBranch = data.filter(s => s.sube_var == 1);
    const withoutBranch = data.filter(s => s.sube_var == 0);

    fillTable("city-table-body", withBranch);
    fillTable("not-branch-table-body", withoutBranch);

    drawChart("cityChart", withBranch);
    drawChart("noBranchChart", withoutBranch);
}


// -----------------------------
// TABLO DOLDURMA
// -----------------------------
function fillTable(id, list) {
    const tbody = document.getElementById(id);
    tbody.innerHTML = "";

    const sorted = list.sort((a, b) => b.skor - a.skor);

    sorted.forEach((s, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${s.sehir}</td>
                <td class="text-right">${s.skor.toFixed(4)}</td>
            </tr>
        `;
    });
}



// -----------------------------
// DONUT CHART (küçük + animasyonlu + hover efektli)
// -----------------------------
function drawChart(canvasId, list) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const sorted = list.sort((a, b) => b.skor - a.skor);

    // MODERN MARKA RENKLERİ
    const modernColors = [
        "#4F9CF9", "#F25C54", "#FFC75F", "#36C98D", 
        "#8A7FF0", "#4E596F", "#FF8FA3", "#2DD4BF"
    ];

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: sorted.map(s => s.sehir),
            datasets: [{
                data: sorted.map(s => s.skor),
                backgroundColor: modernColors,
                borderWidth: 0,
                hoverOffset: 14   // 👉 HOVER'DA DİLİM DIŞARI ÇIKAR
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: "easeOutQuart"
            },

            plugins: {
                legend: {
                    display: true,
                    position: "right",
                    labels: {
                        boxWidth: 12,
                        padding: 12,
                        font: { size: 12 }
                    }
                }
            },

            cutout: "62%"   // 👉 DONUT MERKEZİ — BOYUT TAM UYUM
        }
    });
}



// başlat
loadSehirSkor();
