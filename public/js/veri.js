let aktifTablo = "ilce"; // varsayılan tablo: ilceler

// HTML elementleri
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search");
const rowCount = document.getElementById("row-count");

// Tab Butonları
const btnIlce = document.getElementById("btn-ilce");
const btnSehir = document.getElementById("btn-sehir");

// ------------------------------
// TAB MENU KONTROLÜ
// ------------------------------
btnIlce.addEventListener("click", () => {
    aktifTablo = "ilce";
    btnIlce.classList.add("bg-emerald-600", "text-white");
    btnSehir.classList.remove("bg-emerald-600", "text-white");
    btnSehir.classList.add("bg-slate-300", "text-slate-800");

    loadIlceTable();
});

btnSehir.addEventListener("click", () => {
    aktifTablo = "sehir";
    btnSehir.classList.add("bg-emerald-600", "text-white");
    btnIlce.classList.remove("bg-emerald-600", "text-white");
    btnIlce.classList.add("bg-slate-300", "text-slate-800");

    loadSehirTable();
});

// ------------------------------
// 1) İLÇE TABLOSU
// ------------------------------
async function loadIlceTable() {
    const res = await fetch("/api/ilceler");
    const data = await res.json();

    tableHead.innerHTML = `
        <th class="py-2 text-left">ID</th>
        <th class="py-2 text-left">İlçe</th>
        <th class="py-2 text-left">Nüfus</th>
        <th class="py-2 text-left">Gelir</th>
        <th class="py-2 text-left">Kira</th>
        <th class="py-2 text-left">Ulaşım</th>
        <th class="py-2 text-left">Rakip</th>
    `;

    renderRows(data);
}

// ------------------------------
// 2) ŞEHİR TABLOSU
// ------------------------------
async function loadSehirTable() {
    const res = await fetch("/api/sehir/topsis"); // skorlar
    const data = await res.json();

    tableHead.innerHTML = `
        <th class="py-2 text-left">ID</th>
        <th class="py-2 text-left">Şehir</th>
        <th class="py-2 text-left">TOPSIS Skoru</th>
    `;

    renderRows(data);
}

// ------------------------------
// 3) TABLOYU OLUŞTURMA
// ------------------------------
let tamVeri = []; // arama için tüm veri

function renderRows(data) {
    tamVeri = data; // arama filtresi için saklanıyor

    tableBody.innerHTML = "";

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.classList.add("border-b");

        if (aktifTablo === "ilce") {
            tr.innerHTML = `
                <td class="py-2">${row.id}</td>
                <td class="py-2">${row.ilce}</td>
                <td class="py-2">${row.nufus}</td>
                <td class="py-2">${row.gelir}</td>
                <td class="py-2">${row.kira}</td>
                <td class="py-2">${row.ulasim}</td>
                <td class="py-2">${row.rakip}</td>
            `;
        } else {
            tr.innerHTML = `
                <td class="py-2">${row.id}</td>
                <td class="py-2">${row.sehir}</td>
                <td class="py-2">${row.skor.toFixed(4)}</td>
            `;
        }

        tableBody.appendChild(tr);
    });

    rowCount.textContent = `Toplam Kayıt: ${data.length}`;
}

// ------------------------------
// 4) ARAMA FİLTRESİ
// ------------------------------
searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();

    const filtered = tamVeri.filter(item =>
        JSON.stringify(item).toLowerCase().includes(q)
    );

    renderRows(filtered);
});

// Sayfa ilk açıldığında ilçe verisini yükle
loadIlceTable();
