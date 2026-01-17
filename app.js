const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const session = require("express-session");

// MySQL bağlantısı
require("./db/connection");

// ------------------- MIDDLEWARES -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
    session({
        secret: "kds_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);

// ------------------- ROUTER IMPORT -------------------
const authRoute = require("./router/authRoute");
const sehirRouter = require("./router/sehirRouter");
const ilceRouter = require("./router/ilceRouter");
const dashboardRouter = require("./router/dashboardRouter");   
const tahminlemeRouter = require("./router/tahminlemeRouter"); // <-- TAHMİNLEME IMPORT

// ------------------- ROUTER'LAR -------------------
// TÜM API ROTELARI BURADA TANIMLANMALI
// (express.static'ten önce olmalıdır!)
app.use("/api", authRoute);
app.use("/api/sehir", sehirRouter);
app.use("/api/ilce", ilceRouter);
app.use("/api/dashboard", dashboardRouter);   
app.use("/api/tahminleme", tahminlemeRouter); // <-- TAHMİNLEME KULLANIMI

// ------------------- STATIC FILES -------------------
// API Rotları tanımlandıktan sonra statik dosyalar sunulur.
app.use(express.static("public"));

// ------------------- LOGIN GUARD -------------------
function loginGuard(req, res, next) {
    if (req.session && req.session.loggedIn) return next();
    return res.redirect("/login.html");
}

// ------------------- SAYFALAR ----------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/dashboard.html", loginGuard, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// tahminleme.html sayfasını loginGuard ile koruma altına al
app.get("/tahminleme.html", loginGuard, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "tahminleme.html"));
});

// ------------------- SERVER ------------------------
app.listen(3000, () => {
    console.log("Server çalışıyor: http://localhost:3000");
});