/**
 * server/config/cloudinary.js
 * Konfigurasi Cloudinary SDK untuk upload gambar deteksi
 */

const cloudinary = require('cloudinary').v2

// Konfigurasi menggunakan environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload gambar (base64) ke Cloudinary
 * Gambar disimpan di folder 'sidaun-detections' agar rapi
 *
 * @param {string} base64String - Pure base64 string (tanpa prefix data:...)
 * @returns {Promise<{url: string, publicId: string}>} URL dan public ID gambar
 */
async function uploadKeCloudinary(base64String) {
  try {
    // Tambahkan prefix Data URI yang diperlukan Cloudinary
    const dataURI = `data:image/jpeg;base64,${base64String}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'sidaun-detections',       // Folder di Cloudinary
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'limit' }, // Max 500x500px
        { quality: 'auto:good' },                    // Auto-optimize kualitas
        { format: 'webp' },                          // Konversi ke WebP (lebih kecil)
      ],
    })

    console.log(`[Cloudinary] Upload berhasil: ${result.secure_url}`)

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (err) {
    console.error('[Cloudinary] Gagal upload:', err.message)
    throw err
  }
}

module.exports = { cloudinary, uploadKeCloudinary }
