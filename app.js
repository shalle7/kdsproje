require("dotenv").config(); // En üstte kalmalı
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// MySQL bağlantısı
require("./db/connection");

// ------------------- MIDDLEWARES -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session - Secret bilgisini .env'den alır, yoksa varsayılanı kullanır
app.use(
    session({
        secret: process.env.JWT_SECRET || "kds_default_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);

// ------------------- ROUTER IMPORT -------------------
const authRoute = require("./router/authRoute");
const sehirRouter = require("./router/sehirRouter");
const ilceRouter = require("./router/ilceRouter");
const dashboardRouter = require("./router/dashboardRouter");   
const tahminlemeRouter = require("./router/tahminlemeRouter");

// ------------------- ROUTER'LAR -------------------
app.use("/api", authRoute);
app.use("/api/sehir", sehirRouter);
app.use("/api/ilce", ilceRouter);
app.use("/api/dashboard", dashboardRouter);   
app.use("/api/tahminleme", tahminlemeRouter);

// ------------------- STATIC FILES -------------------
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

app.get("/tahminleme.html", loginGuard, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "tahminleme.html"));
});

// ------------------- SERVER ------------------------
// Portu .env dosyasından alır (PORT=3000 gibi)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
