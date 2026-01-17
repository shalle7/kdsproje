const express = require("express");
const router = express.Router();

const {
    getIlceler,
    getIlcelerBySehir,
    getTopsisIlce,
    getTopsisIlceBySehir
} = require("../controller/ilceController");

// ------------------------------------
// TÜM İLÇELER  →  /api/ilce/ilceler
// ------------------------------------
router.get("/ilceler", getIlceler);

// ------------------------------------
// ŞEHRE GÖRE İLÇELER  →  /api/ilce/ilceler/:sehirId
// ------------------------------------
router.get("/ilceler/:sehirId", getIlcelerBySehir);

// ------------------------------------
// TÜM İLÇELER TOPSIS  →  /api/ilce/topsis-ilce
// ------------------------------------
router.get("/topsis-ilce", getTopsisIlce);

// ------------------------------------
// ŞEHRE GÖRE TOPSIS  →  /api/ilce/topsis-ilce/:sehirId
// ------------------------------------
router.get("/topsis-ilce/:sehirId", getTopsisIlceBySehir);

module.exports = router;
