module.exports = function topsisIlce(list) {

    // İlçelerde kullanılacak kriterler
    const kriterler = ["nufus", "gelir", "kira", "ulasim", "rakip"];

    // Hepsine eşit ağırlık verdik
    const agirlik = [0.20, 0.20, 0.20, 0.20, 0.20];

    // Düşük olması iyi olan kriterler
    const minimize = ["kira", "rakip"];

    // -----------------------------
    // 1) Normalize etme
    // -----------------------------
    const norm = {};
    kriterler.forEach(k => {
        const kareToplam = Math.sqrt(
            list.reduce((sum, x) => sum + Math.pow(Number(x[k]) || 0, 2), 0)
        );
        norm[k] = list.map(x => {
            const val = Number(x[k]) || 0;
            return kareToplam === 0 ? 0 : val / kareToplam;
        });
    });

    // -----------------------------
    // 2) Ağırlıklandırılmış normalize
    // -----------------------------
    const weighted = list.map((x, idx) => {
        let obj = { ...x };
        kriterler.forEach((k, i) => {
            obj[k] = norm[k][idx] * agirlik[i];
        });
        return obj;
    });

    // -----------------------------
    // 3) İdeal ve Anti-ideal değerler
    // -----------------------------
    let ideal = {};
    let anti = {};
    kriterler.forEach(k => {
        const values = weighted.map(x => x[k]);
        const min = Math.min(...values);
        const max = Math.max(...values);

        if (minimize.includes(k)) {
            ideal[k] = min;    // küçük en iyi
            anti[k] = max;     // büyük en kötü
        } else {
            ideal[k] = max;    // büyük en iyi
            anti[k] = min;     // küçük en kötü
        }
    });

    // -----------------------------
    // 4) TOPSIS skorunu hesapla
    // -----------------------------
    let final = weighted.map(x => {
        let dPlus = 0;
        let dMinus = 0;

        kriterler.forEach(k => {
            dPlus += Math.pow(x[k] - ideal[k], 2);
            dMinus += Math.pow(x[k] - anti[k], 2);
        });

        dPlus = Math.sqrt(dPlus);
        dMinus = Math.sqrt(dMinus);

        let skor = (dPlus + dMinus) === 0 ? 0 : dMinus / (dPlus + dMinus);

        return {
            ...x,
            skor: skor
        };
    });

    return final;
};
