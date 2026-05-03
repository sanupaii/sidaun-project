/**
 * server/index.js
 * Entry point backend SiDaun
 * Setup: Express.js + MongoDB (Mongoose) + Cloudinary + CORS
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const syncRoutes = require('./routes/sync')
const chatRoutes = require('./routes/chat')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ──────────────────────────────────────────────────────────

// CORS: izinkan frontend mengakses API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Body parser: JSON dengan limit 50MB untuk gambar base64 bulk
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ─── Routes ─────────────────────────────────────────────────────────────

// Health check root
app.get('/', (req, res) => {
  res.json({
    name: 'SiDaun Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      syncStatus: 'GET /api/sync/status',
      bulkSync: 'POST /api/sync/bulk-detections',
    },
  })
})

// Sync routes
app.use('/api/sync', syncRoutes)

// Chat routes
app.use('/api/chat', chatRoutes)

// Auth routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// ─── Koneksi MongoDB + Start Server ─────────────────────────────────────

async function startServer() {
  try {
    // Validasi environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI tidak ditemukan di file .env')
      console.error('   Salin .env.example menjadi .env dan isi dengan kredensial MongoDB Anda.')
      process.exit(1)
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️  Kredensial Cloudinary belum lengkap di file .env')
      console.warn('   Upload gambar ke cloud tidak akan berfungsi.')
    }

    // Koneksi ke MongoDB
    console.log('🔗 Menghubungkan ke MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB terhubung!')

    // Start Express server
    app.listen(PORT, () => {
      console.log('')
      console.log('═══════════════════════════════════════════')
      console.log(`🌿 SiDaun Backend berjalan di port ${PORT}`)
      console.log(`   http://localhost:${PORT}`)
      console.log('═══════════════════════════════════════════')
      console.log('')
    })
  } catch (err) {
    console.error('❌ Gagal memulai server:', err.message)
    process.exit(1)
  }
}

startServer()
