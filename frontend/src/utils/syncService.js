/**
 * src/utils/syncService.js
 * Service sinkronisasi data deteksi dari IndexedDB ke server
 * Mengelola: konversi Blob→Base64, pengiriman bulk, dan pembersihan antrian
 */

import { ambilSemuaAntrian, hapusDariAntrian, hitungAntrian } from './db'
import { blobKeBase64 } from './syncImageUtils'

// ─── Konfigurasi ────────────────────────────────────────────────────────
// [PENTING] Ganti URL ini dengan URL server Express Anda yang sebenarnya
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const SYNC_ENDPOINT = `${API_BASE_URL}/api/sync/bulk-detections`

/**
 * Jalankan proses sinkronisasi
 * Alur: Baca syncQueue → Konversi Blob ke Base64 → Kirim ke server → Hapus yang berhasil
 *
 * @returns {Promise<{success: boolean, synced: number, failed: number, message: string}>}
 */
export async function jalankanSync() {
  console.log('[SiDaun Sync] Memulai proses sinkronisasi...')

  // 1. Baca semua data dari syncQueue IndexedDB
  const antrean = await ambilSemuaAntrian()

  if (antrean.length === 0) {
    console.log('[SiDaun Sync] Tidak ada data untuk disinkronisasi.')
    return { success: true, synced: 0, failed: 0, message: 'Tidak ada data pending.' }
  }

  console.log(`[SiDaun Sync] Ditemukan ${antrean.length} item untuk disinkronisasi.`)

  // 2. Konversi setiap item: Blob → Base64 agar bisa dikirim via JSON
  const payload = await Promise.all(
    antrean.map(async (item) => {
      let imageBase64 = null
      if (item.imageBlob instanceof Blob) {
        imageBase64 = await blobKeBase64(item.imageBlob)
      }
      return {
        localId: item.localId,
        diseaseType: item.diseaseType,
        confidenceScore: item.confidenceScore,
        scannedAt: item.scannedAt,
        imageBase64, // Base64 string tanpa prefix
      }
    })
  )

  // 3. Kirim ke server secara bulk
  try {
    const response = await fetch(SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detections: payload }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server error ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log('[SiDaun Sync] Response dari server:', result)

    // 4. Hapus item yang berhasil disinkronisasi dari IndexedDB
    // [KRUSIAL] Hanya hapus yang berhasil agar yang gagal bisa di-retry
    let syncedCount = 0
    let failedCount = 0

    if (result.results && Array.isArray(result.results)) {
      for (const item of result.results) {
        if (item.success) {
          await hapusDariAntrian(item.localId)
          syncedCount++
        } else {
          failedCount++
          console.warn(`[SiDaun Sync] Gagal sync item ${item.localId}:`, item.error)
        }
      }
    } else {
      // Jika server mengembalikan format sederhana (semua berhasil)
      for (const item of antrean) {
        await hapusDariAntrian(item.localId)
        syncedCount++
      }
    }

    console.log(`[SiDaun Sync] Selesai! Berhasil: ${syncedCount}, Gagal: ${failedCount}`)

    return {
      success: true,
      synced: syncedCount,
      failed: failedCount,
      message: `${syncedCount} deteksi berhasil disinkronisasi.`,
    }
  } catch (err) {
    console.error('[SiDaun Sync] Gagal mengirim data ke server:', err)
    return {
      success: false,
      synced: 0,
      failed: antrean.length,
      message: `Gagal sinkronisasi: ${err.message}`,
    }
  }
}

/**
 * Cek jumlah item pending di antrian
 * @returns {Promise<number>}
 */
export async function cekJumlahPending() {
  return await hitungAntrian()
}
