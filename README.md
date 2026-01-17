# 🚀 KDS Proje - Karar Destek Sistemi

Bu proje, şehir ve ilçe verileri üzerinden çeşitli analizler yapan, TOPSIS algoritması kullanarak tahminleme ve sıralama sunan bir Karar Destek Sistemi (KDS) uygulamasıdır. **MVC (Model-View-Controller)** mimarisi ile geliştirilmiş, Node.js tabanlı profesyonel bir yapıya sahiptir.

## ✨ Özellikler
- 🔐 **JWT Kimlik Doğrulama:** Güvenli kullanıcı girişi ve kayıt sistemi.
- 📊 **Dashboard:** Şehir ve ilçe bazlı verilerin özet raporları.
- 📉 **Tahminleme ve TOPSIS:** Verilere dayalı karar verme mekanizması ve sıralama algoritmaları.
- 🏙️ **Şehir/İlçe Yönetimi:** Dinamik veritabanı sorguları ve filtreleme.
- 🌐 **Responsive View:** Kullanıcı dostu HTML/CSS arayüzü.

## 🛠️ Kullanılan Teknolojiler
- **Backend:** Node.js, Express.js
- **Veritabanı:** MySQL (mysql2)
- **Güvenlik:** JSON Web Token (JWT), express-session, dotenv
- **Frontend:** Vanilla JS, HTML5, CSS3 (Sidebar.css, Dashboard.css)

## ⚙️ Kurulum ve Çalıştırma

1. **Repoyu indirin:**
   ```bash
   git clone [https://github.com/kullanici_adin/kdsproje.git](https://github.com/kullanici_adin/kdsproje.git)
   cd kdsproje
Bağımlılıkları yükleyin:

Bash

npm install
Çevresel Değişkenleri Ayarlayın: Ana dizinde bir .env dosyası oluşturun ve şu bilgileri doldurun:

Plaintext

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sifreniz
DB_NAME=kds
JWT_SECRET=ozel_anahtar
Uygulamayı başlatın:

Bash

node app.js
📁 Proje Yapısı
controller/: İş mantığının ve SQL sorgularının yönetildiği katman.

router/: API uç noktalarının (endpoints) tanımlandığı yer.

db/: Veritabanı bağlantı yapılandırması.

public/: HTML, CSS ve Client-side JS dosyaları (Arayüz).

utils/: TOPSIS gibi yardımcı matematiksel algoritmalar.

📄 Lisans
Bu proje eğitim amaçlı geliştirilmiştir.


### Nasıl Eklenir?
1. GitHub'da projenin ana sayfasına git.
2. **"Add file"** > **"Create new file"** butonuna bas.
3. Dosya adını `README.md` yap.
4. Yukarıdaki kodu yapıştır ve **"Commit changes"** diyerek kaydet.

Artık projenin ana sayfasında ne işe yaradığı ve nasıl çalıştırılacağı çok net bir şekilde görünecek! Başka bir isteğin var mı?
