/**
 * src/utils/db.js
 * Setup database IndexedDB menggunakan Dexie.js
 * Menyimpan riwayat deteksi penyakit daun cabai + antrian sinkronisasi offline
 */

import Dexie from 'dexie'

const db = new Dexie('SiDaunDB')

// ─── Schema Database IndexedDB ─────────────────────────────────────────
// Versi 1: Tabel riwayat (existing)
db.version(1).stores({
  riwayat: '++id, timestamp, kelas',
})

// Versi 2: Tambah tabel syncQueue untuk Offline-to-Online Sync
// [KRUSIAL] localId sebagai primary key (UUID) agar unik & bisa digunakan untuk upsert
db.version(2).stores({
  riwayat: '++id, timestamp, kelas',
  syncQueue: 'localId, scannedAt',
})

// Versi 3: Tambah userId untuk multi-user offline support
db.version(3).stores({
  riwayat: '++id, timestamp, kelas, userId',
  syncQueue: 'localId, scannedAt, userId',
})

// ═══════════════════════════════════════════════════════════════════════
// FUNGSI RIWAYAT (EXISTING — TIDAK DIUBAH)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Simpan hasil deteksi ke IndexedDB
 */
export async function simpanRiwayat({ imageBase64, kelas, akurasi, penyebab, penanganan, userId }) {
  return await db.riwayat.add({
    timestamp: new Date().toISOString(),
    imageBase64,
    kelas,
    akurasi,
    penyebab,
    penanganan,
    userId, // Simpan userId
  })
}

/**
 * Ambil semua riwayat berdasarkan userId, diurutkan dari terbaru
 */
export async function ambilSemuaRiwayat(userId) {
  if (userId) {
    return await db.riwayat.where('userId').equals(userId).reverse().toArray()
  }
  return await db.riwayat.orderBy('id').reverse().toArray()
}

/**
 * Hapus satu riwayat
 */
export async function hapusRiwayat(id) {
  return await db.riwayat.delete(id)
}

/**
 * Hapus semua riwayat
 */
export async function hapusSemuaRiwayat() {
  return await db.riwayat.clear()
}

// ═══════════════════════════════════════════════════════════════════════
// FUNGSI SYNC QUEUE (BARU — Offline-to-Online Sync)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Tambah data deteksi ke antrian sinkronisasi
 * Data ini akan dikirim ke server saat kembali online
 *
 * @param {Object} payload
 * @param {string} payload.localId - UUID unik sebagai identifier
 * @param {Blob} payload.imageBlob - Blob gambar terkompresi
 * @param {string} payload.diseaseType - Jenis penyakit (nama kelas)
 * @param {number} payload.confidenceScore - Skor keyakinan model (0-1)
 * @param {Date} payload.scannedAt - Waktu deteksi dilakukan
 * @param {string} payload.userId - ID Pengguna
 */
export async function tambahKeAntrian({ localId, imageBlob, diseaseType, confidenceScore, scannedAt, userId }) {
  return await db.syncQueue.put({
    localId,
    imageBlob,
    diseaseType,
    confidenceScore,
    scannedAt: scannedAt.toISOString(),
    userId, // Simpan userId
  })
}

/**
 * Ambil semua data di antrian sinkronisasi (bisa difilter per user jika perlu)
 * @returns {Promise<Array>} Array data yang belum tersinkronisasi
 */
export async function ambilSemuaAntrian(userId) {
  if (userId) {
    return await db.syncQueue.where('userId').equals(userId).toArray()
  }
  return await db.syncQueue.toArray()
}

/**
 * Hapus satu item dari antrian berdasarkan localId
 * Dipanggil setelah item berhasil disinkronisasi ke server
 * @param {string} localId - UUID item yang sudah berhasil sync
 */
export async function hapusDariAntrian(localId) {
  return await db.syncQueue.delete(localId)
}

/**
 * Hitung jumlah item di antrian (untuk badge notifikasi)
 * @returns {Promise<number>} Jumlah item pending
 */
export async function hitungAntrian(userId) {
  if (userId) {
    return await db.syncQueue.where('userId').equals(userId).count()
  }
  return await db.syncQueue.count()
}

/**
 * Kosongkan semua antrian sinkronisasi
 */
export async function hapusSemuaAntrian() {
  return await db.syncQueue.clear()
}

export default db;
