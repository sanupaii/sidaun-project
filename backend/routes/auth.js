/**
 * backend/routes/auth.js
 * Rute untuk Autentikasi (Register, OTP, Login)
 */

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')
const Otp = require('../models/Otp')
const { protect } = require('../middleware/authMiddleware')

// Fungsi untuk generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_sidaun_key', {
    expiresIn: '30d',
  })
}

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Bisa diganti sesuai provider (SendGrid, Mailgun, dll)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// @route   POST /api/auth/register-request
// @desc    Menerima pendaftaran awal dan kirim OTP
// @access  Public
router.post('/register-request', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar' })
    }

    // 2. Generate OTP 6 digit
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Simpan OTP ke database sementara
    await Otp.findOneAndDelete({ email }) // Hapus OTP lama jika ada
    await Otp.create({
      email,
      otp: otpCode,
      userData: { name, password }
    })

    // 4. Kirim email (Gunakan simulasi jika EMAIL_USER tidak di-set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Kode Verifikasi SiDaun',
        html: `<h2>Verifikasi Pendaftaran SiDaun</h2>
               <p>Halo ${name},</p>
               <p>Kode OTP Anda adalah: <strong>${otpCode}</strong></p>
               <p>Kode ini berlaku selama 5 menit.</p>`,
      }
      await transporter.sendMail(mailOptions)
    } else {
      console.log(`[SIMULASI EMAIL] OTP untuk ${email}: ${otpCode}`)
    }

    res.status(200).json({ success: true, message: 'OTP telah dikirim ke email Anda' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Server Error saat mengirim OTP' })
  }
})

// @route   POST /api/auth/register-verify
// @desc    Verifikasi OTP dan buat akun pengguna
// @access  Public
router.post('/register-verify', async (req, res) => {
  try {
    const { email, otp } = req.body

    // 1. Cari OTP di database
    const otpRecord = await Otp.findOne({ email })

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'OTP kadaluwarsa atau email tidak ditemukan' })
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Kode OTP salah' })
    }

    // 2. Buat akun user baru
    const { name, password } = otpRecord.userData
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true,
    })

    // 3. Hapus OTP yang sudah digunakan
    await Otp.deleteOne({ _id: otpRecord._id })

    // 4. Kembalikan respons dengan token
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Server Error saat verifikasi OTP' })
  }
})

// @route   POST /api/auth/login
// @desc    Autentikasi user & dapatkan token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Cari user berdasarkan email
    const user = await User.findOne({ email })

    // Periksa user dan password
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ success: false, error: 'Email atau password salah' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Server Error saat login' })
  }
})

// @route   GET /api/auth/me
// @desc    Dapatkan data user yang sedang login
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      location: req.user.location,
    }
  })
})

// @route   PUT /api/auth/location
// @desc    Update user location
// @access  Private
router.put('/location', protect, async (req, res) => {
  try {
    const { lat, lng, address } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' })
    }

    user.location = { lat, lng, address }
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Lokasi berhasil diperbarui',
      location: user.location
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Server Error saat update lokasi' })
  }
})

module.exports = router
