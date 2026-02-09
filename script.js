// 1. Şalteri (Butonu) ve Giriş Alanını Tanımla
const araButonu = document.getElementById("ara-butonu");
const sehirInput = document.getElementById("sehir-input");

// 2. Butona Basıldığında Ne Olacağını Söyle
araButonu.addEventListener("click", () => {
    const sehir = sehirInput.value.trim(); // Boşlukları temizle
    if (sehir) {
        havaDurumuGetir(sehir);
    } else {
        alert("Kank önce bir şehir yaz!");
    }
});

// 3. Ana Fonksiyon (Senin yazdığın ama tamamladığımız versiyon)
async function havaDurumuGetir(sehir) {
    const katman = document.getElementById("hava-katmani");
    const body = document.body;

    try {
        const yanit = await fetch(`http://localhost:3000/hava?sehir=${sehir}`);
        const paket = await yanit.json();

        // Backend'den gelen paket yapısını parçala
        const veri = paket.havaDurumu;
        const gecmis = paket.gecmis;

        // --- GÖRSEL EFEKTLER ---
        katman.className = "hava-efekti";
        katman.classList.add("aktif");

        const durum = veri.weather[0].main;

        switch (durum) {
            case 'Clear':
                body.style.background = "linear-gradient(135deg, #f7b733, #fc4a1a)";
                katman.classList.remove("aktif");
                break;
            case 'Clouds':
                body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
                katman.classList.add("bulut");
                break;
            case 'Rain':
            case 'Drizzle':
                body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
                katman.classList.add("yagmur");
                break;
            case 'Fog': case 'Mist': case 'Haze':
                body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
                katman.classList.add("sis");
                break;
            case 'Snow':
                body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
                katman.classList.add("kar");
                break;
            default:
                body.style.background = "linear-gradient(135deg, #00b4db, #0083b0)";
        }

        // --- EKRANA YAZDIRMA ---
        document.getElementById("sehir-adi").innerText = veri.name;
        document.getElementById("sicaklik").innerText = Math.round(veri.main.temp) + "°C";
        document.getElementById("durum").innerText = veri.weather[0].description.toUpperCase();

        // --- GEÇMİŞİ GÜNCELLE ---
        const liste = document.getElementById("gecmis-liste");
        if (liste) {
            liste.innerHTML = "";
            gecmis.forEach(s => {
                liste.innerHTML += `<li>${s}</li>`;
            });
        }

    } catch (hata) {
        console.error("Hata:", hata);
        alert("Hata oluştu kank! Backend açık mı kontrol et.");
    }
}