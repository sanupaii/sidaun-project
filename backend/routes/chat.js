const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Inisialisasi Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/', async (req, res) => {
  try {
    const { message, history = [], lahanData } = req.body

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API Key belum dikonfigurasi di backend.'
      })
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Anda adalah DaunAI, asisten virtual cerdas untuk aplikasi SiDaun (Sistem Deteksi Penyakit Daun Cabai). 
Anda ahli dalam pertanian, khususnya tanaman cabai (perawatan, penyakit, hama, pemupukan, dll).
Anda HARUS MENOLAK dengan sopan jika ditanya tentang topik yang tidak berhubungan dengan cabai, pertanian, atau aplikasi SiDaun.
Anda memiliki akses ke data lahan pengguna saat ini untuk memberikan saran yang lebih kontekstual.
Data Lahan Pengguna saat ini: ${lahanData ? JSON.stringify(lahanData) : 'Tidak ada data spesifik.'}
Berikan jawaban yang ringkas, mudah dipahami, dan solutif. Gunakan bahasa Indonesia yang baik, santai tapi profesional. Jangan gunakan formatting markdown yang terlalu kompleks, gunakan bold atau list sederhana saja.`
    })

    // Konversi format history dari frontend ke format Gemini
    let formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Gemini API mewajibkan history diawali oleh role 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift()
    }

    const chatSession = model.startChat({
      history: formattedHistory,
    })

    const result = await chatSession.sendMessage(message)
    const responseText = result.response.text()

    res.json({
      success: true,
      reply: responseText
    })

  } catch (error) {
    console.error('Error in DaunAI Chat:', error)
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat memproses pesan DaunAI.'
    })
  }
})

module.exports = router
