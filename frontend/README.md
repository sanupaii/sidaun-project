# SiDaun - Asisten Cerdas Petani Cabai 🌿🌶️

**SiDaun** adalah sebuah *Progressive Web App* (PWA) berbasis kecerdasan buatan (*Artificial Intelligence*) yang dirancang khusus untuk mendeteksi penyakit pada tanaman cabai secara instan dan akurat. Aplikasi ini memanfaatkan teknologi *Edge AI* untuk melakukan inferensi model langsung di dalam browser pengguna, memungkinkan deteksi dilakukan secara **100% Offline** di area lahan pertanian tanpa sinyal internet.

Proyek ini dikembangkan sebagai bagian dari penelitian skripsi berjudul:
> *"Implementasi Convolutional Neural Network pada Progressive Web App untuk Deteksi Penyakit Daun Cabai (Studi Kasus: Kabupaten Karo)"*

---

## 🌐 Live Demo
Aplikasi ini sudah dapat diakses dan diinstal (PWA) secara langsung melalui tautan berikut:
👉 **[Kunjungi Aplikasi SiDaun](https://si-daun.vercel.app)** *(Catatan: Buka melalui browser Chrome/Safari di HP untuk mengaktifkan fitur Install to Home Screen).*

---

## ✨ Fitur Utama

- 🧠 **Deteksi Real-time dengan CNN**: Menggunakan arsitektur MobileNetV2 yang dioptimalkan untuk perangkat mobile via TensorFlow.js.
- 📶 **PWA & Offline Ready**: Dapat diinstal di Android/iOS dan tetap berfungsi tanpa koneksi internet berkat *Service Worker*.
- 📊 **Riwayat Deteksi**: Penyimpanan hasil diagnosis secara lokal menggunakan IndexedDB (Dexie.js) untuk memantau perkembangan kesehatan tanaman.
- 📖 **Ensiklopedia Penyakit**: Modul edukasi lengkap mengenai gejala, penyebab, penanganan, dan pencegahan penyakit daun cabai dengan sistem *Dynamic Routing*.
- 🎨 **Modern UI/UX**: Antarmuka berbasis *Glassmorphism* dengan *Mesh Gradient* murni (CSS) dan animasi partikel daun yang ringan, responsif, dan elegan.
- 🚀 **Performa Tinggi**: Menggunakan *Code Splitting* (React Lazy) dan *Hardware Acceleration* untuk navigasi yang sangat mulus dan bebas *lag*.

---

## 🛠️ Tech Stack

### Frontend & Antarmuka
- **React.js (Vite)**: Framework utama untuk UI yang sangat cepat.
- **Tailwind CSS**: Styling modern dengan sistem utilitas tingkat lanjut.
- **React Router v6**: Navigasi multi-halaman yang dinamis.
- **Lucide React**: Library ikon vektor yang minimalis.

### Kecerdasan Buatan (AI)
- **TensorFlow.js**: Eksekusi model `.json` langsung di sisi klien (*Client-side*).
- **MobileNetV2**: Arsitektur CNN untuk klasifikasi gambar yang ringan namun sangat akurat.

### Basis Data & Manajemen Offline
- **Dexie.js**: Wrapper untuk IndexedDB sebagai database lokal di browser.
- **PWA (Vite PWA Plugin)**: Manajemen cache tingkat lanjut dan manifest untuk instalasi aplikasi layaknya aplikasi *Native*.

---

## 📂 Struktur Proyek

```text
sidaun/
├── public/              # Aset statis (Ikon, Logo PWA, Model AI TFJS, Ikon Daun)
├── src/
│   ├── components/      # Komponen UI Reusable (Navbar, ScrollToTop, HasilCard)
│   ├── pages/           # Halaman Utama (Landing, Deteksi, Riwayat, About, Edukasi)
│   ├── services/        # Logika Inti (model.js, db.js)
│   ├── index.css        # Styling Global (Mesh Gradient, Animasi, Glassmorphism)
│   └── App.jsx          # Konfigurasi Router & Suspense Loader
├── index.html           # Entry point HTML
└── vite.config.js       # Konfigurasi Environment & Vite PWA Plugin
```
## 🚀 Cara Menjalankan Secara Lokal
Bagi pengembang atau penguji yang ingin menjalankan dan memodifikasi kode ini secara lokal, pastikan Anda sudah menginstal Node.js.

### 1. Clone Repositori
```bash
git clone https://github.com/username-github-kamu/sidaun.git
cd sidaun
```

### 2. Instal Dependensi
```bash
npm install
```
Atau
```bash
npm install --legacy-peer-deps
```
### 3. Jalankan Mode Pengembangan
```bash
npm run dev
```

Buka `http://localhost:5173` di browser Anda untuk melihat hasilnya secara real-time.

### 4. Build untuk Produksi (Menguji PWA & Offline Mode)
```bash
npm run build
npm run preview
```
Buka *link* localhost yang diberikan di terminal untuk menguji fitur Service Worker dan mode offline.

---

## 👨‍💻 Tentang Pengembang
Aplikasi ini dirancang dan dikembangkan oleh:

**Sanupaii**  
Mahasiswa Tingkat Akhir Program Studi Sistem Informasi  
STMIK Triguna Dharma, Medan  

*"Dibuat dengan dedikasi untuk memajukan sektor pertanian di Kabupaten Karo melalui implementasi teknologi digital cerdas."*

---

## 📄 Lisensi
Proyek perangkat lunak ini dibuat murni untuk tujuan akademik dan penelitian skripsi. Seluruh algoritma, desain antarmuka, dan arsitektur kode dimiliki oleh pengembang.
