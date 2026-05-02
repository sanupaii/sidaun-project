/**
 * src/utils/syncService.js
 * Service sinkronisasi data deteksi dari IndexedDB ke server
 * Mengelola: konversi Blob→Base64, pengiriman bulk, dan pembersihan antrian
 */

import { ambilSemuaAntrian, hapusDariAntrian, hitungAntrian } from './db'
import db from './db'
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
export async function jalankanSync(token, userId) {
  console.log('[SiDaun Sync] Memulai proses sinkronisasi...')

  if (!token || !userId) {
    console.log('[SiDaun Sync] User belum login, skip sinkronisasi.')
    return { success: false, synced: 0, failed: 0, message: 'Belum login' }
  }

  // 1. Baca semua data dari syncQueue IndexedDB untuk user ini
  const antrean = await ambilSemuaAntrian(userId)

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
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
export async function cekJumlahPending(userId) {
  if (!userId) return 0;
  return await hitungAntrian(userId)
}

/**
 * Helper untuk mengonversi URL gambar menjadi Base64 string
 * Berguna saat memulihkan history agar gambar bisa diakses secara offline
 */
async function fetchImageAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('[SiDaun Sync] Gagal mengambil gambar dari URL:', url);
    return url; // Balikkan URL asli jika gagal, biar ada fallback
  }
}

/**
 * Hydrate (pulihkan) history deteksi dari server ke IndexedDB lokal
 * @param {string} token 
 * @param {string} userId 
 */
export async function hydrateHistory(token, userId) {
  console.log('[SiDaun Sync] Memulai pemulihan data history dari server...')
  if (!token || !userId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Gagal memuat history dari server');

    const result = await response.json();
    if (result.success && result.data) {
      const historyServer = result.data;
      
      // Ambil existing riwayat user ini
      const existingLokal = await db.riwayat.where('userId').equals(userId).toArray();
      
      // Ubah semua timestamp lokal menjadi ms untuk perbandingan fuzzy
      const existingTimes = existingLokal.map(item => new Date(item.timestamp).getTime());

      let added = 0;
      for (const item of historyServer) {
        // Cek duplikasi berdasarkan waktu dengan toleransi ±10 detik
        const serverTime = new Date(item.scannedAt).getTime();
        const isDuplicate = existingTimes.some(localTime => Math.abs(localTime - serverTime) < 10000);
        
        if (!isDuplicate) {
          // [KRUSIAL] Unduh gambar dan ubah ke Base64 agar tersedia OFFLINE
          let imageToSave = item.imageUrl || null;
          if (imageToSave && imageToSave.startsWith('http')) {
            const base64 = await fetchImageAsBase64(imageToSave);
            if (base64) imageToSave = base64;
          }

          await db.riwayat.add({
            timestamp: new Date(item.scannedAt).toISOString(),
            imageBase64: imageToSave,
            kelas: item.diseaseType,
            akurasi: item.confidenceScore,
            penyebab: 'Dipulihkan dari server',
            penanganan: 'Lihat edukasi',
            userId: userId
          });
          existingTimes.push(serverTime);
          added++;
        }
      }
      console.log(`[SiDaun Sync] Pemulihan selesai. ${added} item baru ditambahkan ke lokal.`);
    }
  } catch (err) {
    console.error('[SiDaun Sync] Error pemulihan data:', err);
  }
}

/**
 * Hapus satu item dari server berdasarkan timestamp
 */
export async function hapusRiwayatServer(token, timestamp, kelas) {
  if (!token || !timestamp) return;
  try {
    let url = `${API_BASE_URL}/api/sync/history/item/${encodeURIComponent(timestamp)}`
    if (kelas) {
      url += `?kelas=${encodeURIComponent(kelas)}`
    }
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal menghapus dari server')
  } catch (err) {
    console.error('[SiDaun Sync]', err)
  }
}

/**
 * Hapus semua item dari server
 */
export async function hapusSemuaRiwayatServer(token) {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/sync/history/all`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal menghapus semua dari server')
  } catch (err) {
    console.error('[SiDaun Sync]', err)
  }
}
