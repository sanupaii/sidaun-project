/**
 * backend/models/Otp.js
 * Skema Mongoose untuk OTP registrasi
 */

const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    // Data pengguna sementara untuk disimpan saat verifikasi berhasil
    userData: {
      name: { type: String, required: true },
      password: { type: String, required: true },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Otomatis hapus dokumen setelah 5 menit (300 detik)
    },
  },
  {
    timestamps: false,
  }
)

const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp
