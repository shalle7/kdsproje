let ilceChart = null;
let cmpChart = null;

// ------------------------------------------
// İlçe adından sayıları sil
// ------------------------------------------
function cleanIlceName(name) {
    return name.replace(/[0-9]/g, "").trim();
}

// -------------------------------------------------
//  ŞEHİRLERİ DROPDOWN'A YÜKLE (VALUE = ID)
// -------------------------------------------------
async function loadSehirler() {
    const res = await fetch("/api/sehir/list");
    const sehirler = await res.json();

    const sehirSelect = document.getElementById("sehirSelect");
    const cmpSehir1 = document.getElementById("cmpSehir1");
    const cmpSehir2 = document.getElementById("cmpSehir2");

    sehirSelect.innerHTML = `<option value="">Şehir seçin</option>`;
    cmpSehir1.innerHTML  = `<option value="">Şehir seçin</option>`;
    cmpSehir2.innerHTML  = `<option value="">Şehir seçin</option>`;

    sehirler.forEach(s => {
        sehirSelect.add(new Option(s.sehir, s.id));
        cmpSehir1.add(new Option(s.sehir, s.id));
        cmpSehir2.add(new Option(s.sehir, s.id));
    });
}

// -------------------------------------------------
//  TOPSIS — ANA TABLO + ANA GRAFİK
// -------------------------------------------------
async function loadTopsisIlce(sehirId) {

    if (!sehirId) {
        updateTable([]);
        updateMainChart([]);
        return;
    }

    const res = await fetch(`/api/ilce/topsis-ilce/${sehirId}`);
    const data = await res.json();

    updateTable(data);
    updateMainChart(data);
}

// -------------------------------------------------
//  TABLO
// -------------------------------------------------
function updateTable(data) {
    const tbody = document.getElementById("topsis-body");
    tbody.innerHTML = "";

    if (!data || !data.length) return;

    const sorted = [...data].sort((a, b) => b.skor - a.skor);

    sorted.forEach((row, i) => {
        tbody.innerHTML += `
            <tr class="${i === 0 ? "bg-emerald-50" : ""}">
                <td>${i + 1}</td>
                <td>${cleanIlceName(row.ilce)}</td>
                <td class="text-right">${row.skor.toFixed(4)}</td>
            </tr>
        `;
    });
}

// -------------------------------------------------
//  ANA GRAFİK
// -------------------------------------------------
function updateMainChart(data) {

    if (ilceChart) ilceChart.destroy();
    if (!data || !data.length) return;

    const ctx = document.getElementById("ilceChart");
    const sorted = [...data].sort((a, b) => b.skor - a.skor).slice(0, 10);

    ilceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: sorted.map(r => cleanIlceName(r.ilce)),
            datasets: [{
                data: sorted.map(r => r.skor),
                backgroundColor: "rgba(16,185,129,0.7)",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// -------------------------------------------------
//  KARŞILAŞTIRMA GRAFİĞİ
// -------------------------------------------------
async function loadCompareChart() {
    const id1 = document.getElementById("cmpSehir1").value;
    const id2 = document.getElementById("cmpSehir2").value;

    if (!id1 || !id2 || id1 === id2) {
        if (cmpChart) cmpChart.destroy();
        return;
    }

    const name1 = document.querySelector(`#cmpSehir1 option[value="${id1}"]`).textContent;
    const name2 = document.querySelector(`#cmpSehir2 option[value="${id2}"]`).textContent;

    const [r1, r2] = await Promise.all([
        fetch(`/api/ilce/topsis-ilce/${id1}`),
        fetch(`/api/ilce/topsis-ilce/${id2}`)
    ]);

    let d1 = await r1.json();
    let d2 = await r2.json();

    d1 = d1.sort((a, b) => b.skor - a.skor).slice(0, 10);
    d2 = d2.sort((a, b) => b.skor - a.skor).slice(0, 10);

    const maxLen = Math.max(d1.length, d2.length);
    while (d1.length < maxLen) d1.push({ ilce: "-", skor: null });
    while (d2.length < maxLen) d2.push({ ilce: "-", skor: null });

    const labels = d1.map((_, i) =>
        `${cleanIlceName(d1[i].ilce)} / ${cleanIlceName(d2[i].ilce)}`
    );

    if (cmpChart) cmpChart.destroy();

    cmpChart = new Chart(document.getElementById("cmpChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: name1,
                    data: d1.map(x => x.skor),
                    backgroundColor: "rgba(59,130,246,0.75)"
                },
                {
                    label: name2,
                    data: d2.map(x => x.skor),
                    backgroundColor: "rgba(234,88,12,0.75)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "top" } },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// -------------------------------------------------
//  SAYFA YÜKLENİNCE
// -------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

    loadSehirler();

    document.getElementById("sehirSelect")
        .addEventListener("change", e => loadTopsisIlce(e.target.value));

    document.getElementById("cmpSehir1")
        .addEventListener("change", loadCompareChart);

    document.getElementById("cmpSehir2")
        .addEventListener("change", loadCompareChart);
});
