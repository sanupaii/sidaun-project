/**
 * src/data/plantData.js
 * Database pengetahuan detail untuk setiap kategori hasil klasifikasi daun cabai.
 * Data bersumber dari riset lapangan dan agronomi tanaman cabai.
 */

export const PLANT_DATA = {
  'Daun bercak': {
    nama: 'Bercak Daun (Cercospora)',
    deskripsi: 'Munculnya bercak-bercak kecil berbentuk bulat pada daun dengan pusat berwarna pucat dan tepi cokelat tua.',
    penyebab: 'Infeksi jamur Cercospora capsici yang berkembang biak cepat pada kelembapan tinggi dan jarak tanam yang terlalu rapat.',
    penanganan: 'Segera pangkas dan kumpulkan daun yang terinfeksi agar spora jamur tidak menyebar tertiup angin.',
    rekomendasiObat: 'Fungisida berbahan aktif Mankozeb, Difenokonazol, atau Propineb.',
    pencegahan: 'Atur jarak tanam untuk sirkulasi udara, perbaiki drainase bedengan, dan semprot fungisida kontak secara preventif.',
    tindakanLanjut: 'Musnahkan (bakar) daun terinfeksi jauh dari area lahan. Jangan biarkan membusuk di sekitar tanaman.',
    warna: 'orange',
    emoji: '🍂'
  },
  'Daun keriting': {
    nama: 'Keriting Daun (Hama Kutu)',
    deskripsi: 'Tepian daun melengkung ke atas/bawah, tekstur kaku, berkerut, dan pertumbuhan pucuk menjadi kerdil.',
    penyebab: 'Serangan hama vektor pemakan cairan tanaman seperti Thrips, Kutu Daun (Aphids), atau Tungau.',
    penanganan: 'Lakukan sanitasi gulma di sekitar area lahan karena sering menjadi sarang persembunyian hama kutu.',
    rekomendasiObat: 'Insektisida atau akarisida berbahan aktif Abamektin, Imidakloprid, atau Klorfenapir (semprot bawah daun).',
    pencegahan: 'Gunakan mulsa plastik perak-hitam untuk mengusir hama melalui pantulan cahaya matahari.',
    tindakanLanjut: 'Rotasi bahan aktif pestisida setiap 2-3 kali aplikasi agar hama tidak kebal (resisten). Pantau pucuk baru.',
    warna: 'yellow',
    emoji: '🌀'
  },
  'Daun kuning': {
    nama: 'Virus Kuning (Bule)',
    deskripsi: 'Seluruh helaian daun menguning mencolok (klorosis) dengan tulang daun yang menebal dan tanaman berhenti tumbuh.',
    penyebab: 'Infeksi Begomovirus (Virus Gemini) melalui serangga Kutu Kebul, atau defisiensi hara Nitrogen/Magnesium.',
    penanganan: 'Jika kuning belang & pucuk mengkerut (virus), cabut tanaman. Jika kuning merata daun tua, berikan pupuk susulan.',
    rekomendasiObat: 'Obati hama pembawa (Kutu Kebul) dengan Tiametoksam. Untuk defisiensi, gunakan NPK dan pupuk mikro daun.',
    pencegahan: 'Basmi Kutu Kebul sejak masa persemaian dan bersihkan inang alternatif (rumput liar) di sekitar lahan.',
    tindakanLanjut: 'Tanaman terinfeksi virus wajib dibakar atau dibuang jauh dari blok lahan untuk memutus rantai penyebaran.',
    warna: 'red',
    emoji: '⚠️'
  },
  'Daun sehat': {
    nama: 'Kondisi Normal (Sehat)',
    deskripsi: 'Permukaan daun berwarna hijau cerah/tua merata, tekstur lentur, melebar sempurna tanpa cacat.',
    penyebab: 'Manajemen lahan yang baik, ketersediaan nutrisi dan air optimal, serta pertahanan tanaman yang kuat.',
    penanganan: 'Tidak memerlukan tindakan pengobatan. Pertahankan kondisi lingkungan yang stabil.',
    rekomendasiObat: 'Berikan pupuk organik cair (POC) atau pupuk daun asam amino untuk menjaga imunitas tanaman.',
    pencegahan: 'Konsistensi penyiraman, pemupukan rutin sesuai usia, dan pemantauan visual berkala.',
    tindakanLanjut: 'Jadikan blok ini sebagai standar (baseline) kesehatan untuk memantau blok lahan lainnya setiap 3 hari.',
    warna: 'green',
    emoji: '✅'
  }
}
