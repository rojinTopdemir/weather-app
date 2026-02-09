require('dotenv').config(); // 1. BU SATIRI EN ÜSTE EKLE
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(cors());

// 2. ANAHTARI BURADAN SİLDİK, GÜVENLİ YERDEN ÇEKİYORUZ
const API_KEY = process.env.WEATHER_API_KEY;
const path = './gecmis.json';

let aramaGecmisi = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];

app.get('/hava', async (req, res) => {
    const sehir = req.query.sehir;
    // URL yapısı aynı kalıyor, API_KEY artık process.env'den geliyor
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(sehir)}&appid=${API_KEY}&units=metric&lang=tr`;

    try {
        const cevap = await axios.get(url);
        const veri = cevap.data;

        if (!aramaGecmisi.includes(veri.name)) {
            aramaGecmisi.push(veri.name);
            if (aramaGecmisi.length > 5) aramaGecmisi.shift();
            fs.writeFileSync(path, JSON.stringify(aramaGecmisi));
        }
        res.json({ havaDurumu: veri, gecmis: aramaGecmisi });
    } catch (hata) {
        res.status(404).json({ mesaj: "Şehir bulunamadı" });
    }
});

app.listen(3000, () => console.log("Backend tıkır tıkır ve GÜVENLİ çalışıyor!"));