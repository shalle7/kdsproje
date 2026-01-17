module.exports = function topsis(list) {

    const kriterler = ["nufus", "gelir", "kira", "ulasim", "rakip", "online_satis"];
    const agirlik = [0.25, 0.25, 0.15, 0.15, 0.1, 0.1];
    const minimize = ["kira", "rakip"];

    // normalize
    let norm = {};
    kriterler.forEach(k => {
        const kareToplam = Math.sqrt(list.reduce((sum, x) => sum + Math.pow(x[k], 2), 0));
        norm[k] = list.map(x => x[k] / kareToplam);
    });

    // ağırlıklı normalize
    let weighted = list.map((x, idx) => {
        let obj = { ...x };
        kriterler.forEach((k, i) => {
            obj[k] = norm[k][idx] * agirlik[i];
        });
        return obj;
    });

    // ideal ve anti-ideal
    let ideal = {};
    let anti = {};

    kriterler.forEach((k, i) => {
        if (minimize.includes(k)) {
            ideal[k] = Math.min(...weighted.map(x => x[k]));
            anti[k] = Math.max(...weighted.map(x => x[k]));
        } else {
            ideal[k] = Math.max(...weighted.map(x => x[k]));
            anti[k] = Math.min(...weighted.map(x => x[k]));
        }
    });

    // skor hesapla
    let final = weighted.map(x => {
        let dPlus = Math.sqrt(kriterler.reduce((sum, k) => sum + Math.pow(x[k] - ideal[k], 2), 0));
        let dMinus = Math.sqrt(kriterler.reduce((sum, k) => sum + Math.pow(x[k] - anti[k], 2), 0));
        let skor = dMinus / (dPlus + dMinus);
        return { ...x, skor };
    });

    return final;
};
