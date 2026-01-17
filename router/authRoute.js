const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("Gelen veri:", username, password);

    if (username === "admin" && password === "1234") {

        // KRİTİK SATIR
        req.session.loggedIn = true;

        return res.json({
            ok: true,
            message: "Giriş başarılı",
            redirect: "/dashboard.html"
        });
    }

    return res.status(401).json({
        ok: false,
        message: "Hatalı kullanıcı adı veya şifre"
    });
});

module.exports = router;
