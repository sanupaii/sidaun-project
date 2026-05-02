/**
 * src/utils/imageUtils.js
 * Utilitas kompresi gambar menggunakan HTML Canvas
 * Mencegah IndexedDB membengkak dari penyimpanan gambar resolusi tinggi
 */

/**
 * Kompres dan resize gambar menggunakan Canvas API
 * Gambar di-resize proporsional (max 500px di sisi terpanjang)
 * lalu di-encode ke JPEG dengan kualitas rendah
 *
 * @param {HTMLImageElement|HTMLVideoElement} imageElement - Elemen gambar sumber
 * @param {number} maxSize - Ukuran maksimal (px) untuk sisi terpanjang (default: 500)
 * @param {number} quality - Kualitas JPEG 0-1 (default: 0.6)
 * @returns {string} Data URL base64 gambar terkompresi (format: "data:image/jpeg;base64,...")
 */
export function kompresGambar(imageElement, maxSize = 500, quality = 0.6) {
  // Dimensi asli gambar
  const srcWidth = imageElement.naturalWidth || imageElement.videoWidth || imageElement.width
  const srcHeight = imageElement.naturalHeight || imageElement.videoHeight || imageElement.height

  // Hitung dimensi baru secara proporsional agar tidak melebihi maxSize
  let newWidth = srcWidth
  let newHeight = srcHeight

  if (srcWidth > maxSize || srcHeight > maxSize) {
    if (srcWidth >= srcHeight) {
      // Landscape atau square: lebarkan hingga maxSize
      newWidth = maxSize
      newHeight = Math.round((srcHeight / srcWidth) * maxSize)
    } else {
      // Portrait: tinggi hingga maxSize
      newHeight = maxSize
      newWidth = Math.round((srcWidth / srcHeight) * maxSize)
    }
  }

  // Buat canvas sementara untuk proses kompresi
  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight

  const ctx = canvas.getContext('2d')

  // Gambar ulang di canvas dengan dimensi baru
  ctx.drawImage(imageElement, 0, 0, newWidth, newHeight)

  // Encode ke base64 JPEG dengan kualitas yang ditentukan
  // Format JPEG dipilih karena lebih kecil dari PNG untuk foto natural
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Konversi File (dari input type=file) ke Object URL untuk preview
 * @param {File} file - File gambar
 * @returns {string} Object URL sementara
 */
export function fileToObjectURL(file) {
  return URL.createObjectURL(file)
}

/**
 * Format timestamp ISO ke string tanggal Indonesia yang mudah dibaca
 * @param {string} isoString - Timestamp ISO 8601
 * @returns {string} Contoh: "07 Apr 2026, 20:35"
 */
export function formatTanggal(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
