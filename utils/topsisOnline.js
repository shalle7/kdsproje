function topsisOnline(data) {

    const kriterler = ["nufus", "gelir", "online_satis"];

    const agirliklar = {
        nufus: 0.30,
        gelir: 0.25,
        online_satis: 0.45
    };

    // Hepsi maksimum iyi
    const minimizeList = [];

    // 1) Normalize
    const normalize = [];
    kriterler.forEach(k => {
        const kareToplam = Math.sqrt(
            data.reduce((sum, row) => sum + Math.pow(row[k], 2), 0)
        );
        normalize.push(data.map(row => row[k] / kareToplam));
    });

    // 2) Weighted normalize
    const weighted = normalize.map((col, i) =>
        col.map(v => v * agirliklar[kriterler[i]])
    );

    // 3) İdeal / Negatif ideal
    const idealPlus = [];
    const idealMinus = [];

    kriterler.forEach((k, i) => {
        const column = weighted[i];
        idealPlus.push(Math.max(...column));
        idealMinus.push(Math.min(...column));
    });

    // 4) Uzaklıklar
    const dPlus = data.map((_, r) =>
        Math.sqrt(
            kriterler.reduce(
                (s, _, c) => s + Math.pow(weighted[c][r] - idealPlus[c], 2),
                0
            )
        )
    );

    const dMinus = data.map((_, r) =>
        Math.sqrt(
            kriterler.reduce(
                (s, _, c) => s + Math.pow(weighted[c][r] - idealMinus[c], 2),
                0
            )
        )
    );

    // 5) Skor
    const result = data.map((row, i) => ({
        id: row.id,
        sehir: row.sehir,
        skor: dMinus[i] / (dPlus[i] + dMinus[i]),
        nufus: row.nufus,
        gelir: row.gelir,
        online_satis: row.online_satis
    }));

    return result.sort((a, b) => b.skor - a.skor);
}

module.exports = topsisOnline;
