/**
 * src/utils/model.js
 * Modul pengelolaan model TensorFlow.js untuk deteksi penyakit daun cabai
 * Menggunakan arsitektur MobileNetV2 yang sudah di-convert ke format TFJS
 */

import * as tf from '@tensorflow/tfjs'

// ─── Label Kelas (WAJIB berurutan sesuai index output model) ──────────────────
const LABELS = [
  'Daun bercak',   // index 0
  'Daun keriting', // index 1
  'Daun kuning',   // index 2
  'Daun sehat',    // index 3
]

// ─── Data Rekomendasi ──────────────────────────────────────────────
export const REKOMENDASI = {
  'Daun bercak': {
    penyebab: 'Infeksi jamur Cercospora capsici, sering terjadi saat kelembapan udara tinggi.',
    penanganan: 'Gunakan fungisida berbahan aktif mankozeb. Pangkas dan buang daun yang terinfeksi jauh dari lahan agar spora tidak menyebar.',
    warna: 'orange',
  },
  'Daun keriting': {
    penyebab: 'Serangan hama (Kutu daun/Aphids, Thrips, atau Tungau) yang menghisap cairan daun.',
    penanganan: 'Semprotkan insektisida berbahan aktif abamektin. Cabut dan musnahkan tanaman yang sudah rusak parah.',
    warna: 'yellow',
  },
  'Daun kuning': {
    penyebab: 'Infeksi Virus Gemini dari kutu kebul, atau kekurangan unsur hara makro (Nitrogen/Magnesium).',
    penanganan: 'Berikan pupuk daun kaya Nitrogen & Magnesium. Jika positif virus gemini (kuning terang berurat), segera cabut tanaman (eradikasi).',
    warna: 'red',
  },
  'Daun sehat': {
    penyebab: 'Kondisi tanaman optimal dan terawat.',
    penanganan: 'Pertahankan jadwal penyiraman, pemupukan, dan sanitasi lahan yang sudah berjalan.',
    warna: 'green',
  },
}

let modelInstance = null
let modelType = null

/**
 * Load model TF.js dari folder public/model/
 * Menggunakan pattern singleton agar model hanya di-fetch dan di-compile sekali.
 * 
 * @returns {Promise<tf.GraphModel|tf.LayersModel>} Instance model yang siap
 */
export async function loadModel() {
  if (modelInstance) {
    return modelInstance
  }

  console.log('[SiDaun] Memuat model TF.js dari /model/model.json ...')

  // 1. FORCE CPU BACKEND (Perbaikan untuk HP dengan WebGL Driver Bermasalah)
  // Memaksa TFJS menggunakan CPU untuk menghindari bug presisi (index 0) pada GPU HP tertentu.
  try {
    console.log('[SiDaun] Mengatur backend ke CPU untuk stabilitas...');
    await tf.setBackend('cpu');
    await tf.ready();
    console.log('[SiDaun] Backend aktif:', tf.getBackend());
  } catch (backendErr) {
    console.warn('[SiDaun] Gagal memaksa backend CPU, menggunakan default.', backendErr);
  }

  try {
    // KOMENTAR EDUKASI: Fungsi ini memuat model CNN (Convolutional Neural Network) 
    // dari format file json dan bobot (bin) yang diterjemahkan agar bisa dijalankan di browser.
    modelInstance = await tf.loadGraphModel('/model/model.json')
    modelType = 'graph'
    console.log('[SiDaun] Loaded sebagai GraphModel.')
  } catch (graphErr) {
    console.warn('[SiDaun] GraphModel gagal, mencoba LayersModel...', graphErr.message)
    // Fallback jika bukan berupa GraphModel
    modelInstance = await tf.loadLayersModel('/model/model.json')
    modelType = 'layers'
    console.log('[SiDaun] Loaded sebagai LayersModel.')
  }

  // Warm-up prediksi agar ter-compile dan tidak lag saat pertama kali prediksi
  const dummyInput = tf.zeros([1, 224, 224, 3])
  const warmupResult = modelInstance.predict(dummyInput)
  if (Array.isArray(warmupResult)) {
    warmupResult.forEach(t => t.dispose())
  } else {
    warmupResult.dispose()
  }
  dummyInput.dispose()

  console.log(`[SiDaun] Model (${modelType}) berhasil dimuat dan siap digunakan.`)
  return modelInstance
}

/**
 * Jalankan prediksi pada gambar yang diberikan
 *
 * @param {HTMLImageElement} imageElement - Elemen <img> yang sudah loaded
 * @returns {Promise<{kelas: string, akurasi: number, penyebab: string, penanganan: string, allScores: number[]}>}
 */
export async function predict(imageElement) {
  if (!modelInstance) {
    throw new Error('Model belum di-load. Panggil loadModel() terlebih dahulu.')
  }

  // 1. OFF-SCREEN CANVAS RESIZING (Solusi untuk Performa & Memory)
  // Sangat penting terutama saat menggunakan backend CPU agar tidak memproses gambar 4K.
  const canvas = document.createElement('canvas')
  canvas.width = 224
  canvas.height = 224
  const ctx = canvas.getContext('2d')

  // Gambar ulang dan kecilkan gambar asli ke 224x224
  ctx.drawImage(imageElement, 0, 0, 224, 224)

  // 2. TFJS PREDICTION (Memory Management via tf.tidy)
  const scoresArray = tf.tidy(() => {
    // Gunakan elemen CANVAS yang sudah berukuran kecil sebagai input
    const rawTensor = tf.browser.fromPixels(canvas)

    // Langsung konversi ke float (sudah 224x224)
    const floated = rawTensor.toFloat()
    
    // Normalisasi warna dari rentang 255 RGB ke [-1, 1]
    const normalized = floated.sub(tf.scalar(127.5)).div(tf.scalar(127.5))

    // Tambahkan dimensi batch -> [1, 224, 224, 3]
    const batched = normalized.expandDims(0)

    let output = modelInstance.predict(batched)

    // Jika output berupa object (biasanya pada GraphModel), ambil tensor pertamanya
    if (output && typeof output === 'object' && !output.shape) {
      output = Object.values(output)[0]
    }

    // CATATAN PENTING: Model baru ini sudah memiliki layer Softmax di dalam arsitekturnya
    // (node 'dense_1/Softmax' pada model.json). Memanggil .softmax() lagi di sini
    // akan menyebabkan "double softmax" yang meratakan distribusi probabilitas
    // dan membuat confidence terlihat jauh lebih rendah dari nilai aslinya.
    // Cukup ambil output langsung tanpa softmax tambahan.
    return Array.from(output.dataSync())
  })

  const indexMax = scoresArray.indexOf(Math.max(...scoresArray))
  const kelasHasil = LABELS[indexMax]
  const akurasi = scoresArray[indexMax]
  const rekomendasiData = REKOMENDASI[kelasHasil]

  return {
    kelas: kelasHasil,
    akurasi: akurasi,
    penyebab: rekomendasiData.penyebab,
    penanganan: rekomendasiData.penanganan,
    warna: rekomendasiData.warna,
    allScores: scoresArray,
  }
}
