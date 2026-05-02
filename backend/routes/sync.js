/**
 * server/routes/sync.js
 * Route handler untuk sinkronisasi data deteksi dari frontend
 *
 * Endpoint: POST /api/sync/bulk-detections
 * Alur per item:
 *   1. Terima data deteksi (dengan gambar base64)
 *   2. Upload gambar ke Cloudinary → dapat URL
 *   3. Upsert ke MongoDB berdasarkan localId (mencegah duplikasi)
 *   4. Return response per item (berhasil/gagal)
 */

const express = require('express')
const router = express.Router()
const Detection = require('../models/Detection')
const { uploadKeCloudinary } = require('../config/cloudinary')

/**
 * POST /api/sync/bulk-detections
 * Body: { detections: [ { localId, diseaseType, confidenceScore, scannedAt, imageBase64 }, ... ] }
 *
 * [KRUSIAL] Menggunakan upsert berdasarkan localId
 * Jika item dengan localId yang sama sudah ada, data akan di-update (bukan duplikat baru)
 * Ini mencegah duplikasi jika terjadi kegagalan jaringan di tengah proses
 */
router.post('/bulk-detections', async (req, res) => {
  try {
    const { detections } = req.body

    // Validasi input
    if (!detections || !Array.isArray(detections) || detections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Field "detections" harus berupa array yang tidak kosong.',
      })
    }

    // Batasi jumlah item per request untuk mencegah abuse
    if (detections.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maksimal 50 item per request.',
      })
    }

    console.log(`[Sync] Menerima ${detections.length} deteksi untuk disinkronisasi...`)

    // Proses setiap item deteksi
    const results = await Promise.allSettled(
      detections.map(async (item) => {
        const { localId, diseaseType, confidenceScore, scannedAt, imageBase64 } = item

        // Validasi field wajib
        if (!localId || !diseaseType || confidenceScore === undefined) {
          throw new Error(`Data tidak lengkap untuk item ${localId}`)
        }

        // 1. Upload gambar ke Cloudinary (jika ada)
        let imageUrl = null
        if (imageBase64) {
          try {
            const uploadResult = await uploadKeCloudinary(imageBase64)
            imageUrl = uploadResult.url
          } catch (uploadErr) {
            console.warn(`[Sync] Gagal upload gambar untuk ${localId}:`, uploadErr.message)
            // Lanjutkan tanpa gambar — data tetap disimpan
          }
        }

        // 2. Upsert ke MongoDB berdasarkan localId
        // [KRUSIAL] findOneAndUpdate dengan upsert: true
        // - Jika localId belum ada → INSERT baru
        // - Jika localId sudah ada → UPDATE (tidak duplikat)
        const savedDetection = await Detection.findOneAndUpdate(
          { localId }, // Filter: cari berdasarkan localId
          {
            $set: {
              diseaseType,
              confidenceScore,
              imageUrl,
              scannedAt: new Date(scannedAt),
              syncedAt: new Date(),
            },
          },
          {
            upsert: true,       // Insert jika belum ada
            new: true,          // Return dokumen yang sudah di-update
            runValidators: true, // Jalankan validasi schema
          }
        )

        console.log(`[Sync] ✅ Item ${localId} berhasil disimpan (${diseaseType})`)

        return {
          localId,
          success: true,
          imageUrl: savedDetection.imageUrl,
        }
      })
    )

    // Format response: pisahkan yang berhasil dan gagal
    const formattedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return {
          localId: detections[index]?.localId || 'unknown',
          success: false,
          error: result.reason?.message || 'Unknown error',
        }
      }
    })

    const successCount = formattedResults.filter(r => r.success).length
    const failedCount = formattedResults.filter(r => !r.success).length

    console.log(`[Sync] Selesai! Berhasil: ${successCount}, Gagal: ${failedCount}`)

    res.status(200).json({
      success: true,
      message: `${successCount} dari ${detections.length} deteksi berhasil disinkronisasi.`,
      synced: successCount,
      failed: failedCount,
      results: formattedResults,
    })
  } catch (err) {
    console.error('[Sync] Error fatal:', err)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat sinkronisasi.',
      error: err.message,
    })
  }
})

/**
 * GET /api/sync/status
 * Endpoint untuk mengecek koneksi ke server (health check)
 */
router.get('/status', (req, res) => {
  res.json({
    online: true,
    timestamp: new Date().toISOString(),
    message: 'SiDaun Backend aktif dan siap menerima data.',
  })
})

module.exports = router
