/**
 * src/utils/syncImageUtils.js
 * Utilitas kompresi gambar untuk sinkronisasi offline-to-online
 * Menggunakan library browser-image-compression untuk kompresi optimal
 */

import imageCompression from 'browser-image-compression'

/**
 * Kompresi gambar untuk disimpan di IndexedDB syncQueue
 * Target: max 500x500px, ukuran < 100KB
 *
 * @param {File|Blob} imageFile - File gambar dari input atau Blob
 * @returns {Promise<Blob>} Blob gambar terkompresi
 */
export async function kompresUntukSync(imageFile) {
  const options = {
    maxSizeMB: 0.1,         // Maksimal 100KB (0.1MB)
    maxWidthOrHeight: 500,   // Max 500px di sisi terpanjang
    useWebWorker: true,      // Gunakan Web Worker agar tidak blokir UI
    fileType: 'image/jpeg',  // Output JPEG untuk ukuran lebih kecil
    initialQuality: 0.7,     // Kualitas awal 70%
  }

  try {
    console.log('[SiDaun Sync] Mengompresi gambar untuk sync...')
    console.log(`[SiDaun Sync] Ukuran asli: ${(imageFile.size / 1024).toFixed(1)}KB`)

    const compressedBlob = await imageCompression(imageFile, options)

    console.log(`[SiDaun Sync] Ukuran setelah kompresi: ${(compressedBlob.size / 1024).toFixed(1)}KB`)
    return compressedBlob
  } catch (err) {
    console.error('[SiDaun Sync] Gagal mengompresi gambar:', err)
    // Fallback: kembalikan file asli jika kompresi gagal
    return imageFile
  }
}

/**
 * Konversi Blob ke Base64 string untuk dikirim ke server
 * [KRUSIAL] Diperlukan karena JSON tidak bisa mengirim Blob langsung
 *
 * @param {Blob} blob - Blob gambar
 * @returns {Promise<string>} Base64 string (tanpa prefix data:...)
 */
export function blobKeBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      // Hapus prefix "data:image/jpeg;base64," agar hanya pure base64
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Konversi base64 Data URL (dari canvas) ke File object
 * Diperlukan untuk bisa dikompresi oleh browser-image-compression
 *
 * @param {string} dataURL - Data URL dari canvas (format: "data:image/jpeg;base64,...")
 * @param {string} filename - Nama file output
 * @returns {File} File object
 */
export function dataURLkeFile(dataURL, filename = 'leaf.jpg') {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
