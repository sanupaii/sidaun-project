/**
 * server/models/Detection.js
 * Skema Mongoose untuk data deteksi penyakit daun cabai
 * Menyimpan hasil deteksi yang sudah disinkronisasi dari frontend
 */

const mongoose = require('mongoose')

const detectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // [KRUSIAL] localId sebagai unique identifier dari frontend
    // Digunakan untuk upsert agar tidak ada duplikasi data
    localId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Jenis penyakit yang terdeteksi (nama kelas dari model AI)
    // Contoh: "Daun bercak", "Daun keriting", "Daun kuning", "Daun sehat"
    diseaseType: {
      type: String,
      required: true,
    },

    // Skor keyakinan model (0-1)
    // Contoh: 0.95 = 95% yakin
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    // URL gambar di Cloudinary (diisi setelah upload berhasil)
    imageUrl: {
      type: String,
      default: null,
    },

    // Waktu deteksi dilakukan di perangkat pengguna (bisa offline)
    scannedAt: {
      type: Date,
      required: true,
    },

    // Waktu data berhasil disinkronisasi ke server
    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Otomatis tambahkan createdAt dan updatedAt
    timestamps: true,
  }
)

const Detection = mongoose.model('Detection', detectionSchema)

module.exports = Detection
