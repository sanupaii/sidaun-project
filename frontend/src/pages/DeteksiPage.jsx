/**
 * src/pages/DeteksiPage.jsx
 * Halaman utama - deteksi penyakit daun cabai
 * Fitur: input kamera/galeri, preview gambar, analisis TF.js, auto-save riwayat
 * ⚠️ LOGIKA TFJS DAN INDEXEDDB TIDAK DIUBAH SAMA SEKALI
 */

import { useState, useRef, useCallback } from 'react'
import { Camera, ImagePlus, Loader2, Leaf, Sparkles, RefreshCw, Brain } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { predict } from '../utils/model'
import { simpanRiwayat, tambahKeAntrian } from '../utils/db'
import { kompresGambar } from '../utils/imageUtils'
import { kompresUntukSync, dataURLkeFile } from '../utils/syncImageUtils'
import { useSync } from '../context/SyncContext'
import HasilKartu from '../components/HasilKartu'

// THRESHOLD: Confidence di bawah nilai ini dianggap "foto kurang jelas"
const CONFIDENCE_THRESHOLD = 0.70

function DeteksiPage({ modelReady }) {
  const { refreshPending } = useSync()
  const [previewURL, setPreviewURL] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasil, setHasil] = useState(null)
  const [rendahKepercayaan, setRendahKepercayaan] = useState(null) // { akurasi }
  const [error, setError] = useState(null)
  const [savedInfo, setSavedInfo] = useState(null)

  const imgRef = useRef(null)
  const kameraRef = useRef(null)
  const galeriRef = useRef(null)

  /**
   * Handler saat file gambar dipilih (dari kamera atau galeri)
   * Membuat preview URL dan reset state sebelumnya
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setHasil(null)
    setRendahKepercayaan(null)
    setError(null)
    setSavedInfo(null)

    if (previewURL) URL.revokeObjectURL(previewURL)
    setPreviewURL(URL.createObjectURL(file))
  }, [previewURL])

  /**
   * Handler utama analisis gambar
   * Alur: validasi → loading → jeda UI → prediksi TF.js → cek confidence → simpan → tampil hasil
   */
  const handleAnalisis = useCallback(async () => {
    if (!imgRef.current || !modelReady) return

    setIsLoading(true)
    setError(null)
    setHasil(null)
    setRendahKepercayaan(null)
    setSavedInfo(null)

    // KOMENTAR PENTING: Jeda 50ms untuk memberikan waktu bagi browser me-render
    // animasi loading sebelum UI thread diblokir oleh komputasi berat TensorFlow CPU.
    await new Promise(resolve => setTimeout(resolve, 50))

    try {
      console.log('[SiDaun] Memulai prediksi (CPU Backend)...')
      const prediksi = await predict(imgRef.current)
      console.log('[SiDaun] Prediksi selesai:', prediksi.kelas, `${(prediksi.akurasi * 100).toFixed(1)}%`)

      // CEK THRESHOLD CONFIDENCE:
      // Jika keyakinan model <= 70%, tampilkan peringatan foto ulang
      // dan TIDAK simpan ke riwayat karena hasilnya tidak dapat diandalkan.
      if (prediksi.akurasi <= CONFIDENCE_THRESHOLD) {
        console.log(`[SiDaun] Confidence terlalu rendah (${(prediksi.akurasi * 100).toFixed(1)}%), meminta foto ulang.`)
        setRendahKepercayaan({ akurasi: prediksi.akurasi })
        return
      }

      const imageBase64 = kompresGambar(imgRef.current, 500, 0.6)

      // ── Simpan ke Riwayat (existing flow — tidak diubah) ──
      const savedId = await simpanRiwayat({
        imageBase64,
        kelas: prediksi.kelas,
        akurasi: prediksi.akurasi,
        penyebab: prediksi.penyebab,
        penanganan: prediksi.penanganan,
      })
      console.log('[SiDaun] Riwayat tersimpan dengan ID:', savedId)
      setSavedInfo(savedId)

      // ── Simpan ke Sync Queue (BARU — untuk sinkronisasi ke server) ──
      try {
        // Konversi base64 Data URL ke File, lalu kompres untuk sync
        const fileUntukSync = dataURLkeFile(imageBase64, `leaf-${Date.now()}.jpg`)
        const blobTerkompresi = await kompresUntukSync(fileUntukSync)

        await tambahKeAntrian({
          localId: uuidv4(),
          imageBlob: blobTerkompresi,
          diseaseType: prediksi.kelas,
          confidenceScore: prediksi.akurasi,
          scannedAt: new Date(),
        })
        console.log('[SiDaun Sync] Data deteksi ditambahkan ke antrian sinkronisasi.')

        // Refresh jumlah pending di SyncContext
        await refreshPending()
      } catch (syncErr) {
        // Sync queue gagal bukan critical error — riwayat lokal tetap tersimpan
        console.warn('[SiDaun Sync] Gagal menambah ke antrian sync (non-critical):', syncErr)
      }

      setHasil({ ...prediksi, imageBase64 })

    } catch (err) {
      console.error('[SiDaun] Error saat prediksi:', err)
      setError('Gagal menganalisis gambar. Pastikan gambar valid dan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }, [modelReady])

  /**
   * Reset semua state ke kondisi awal untuk analisis baru
   */
  const handleReset = useCallback(() => {
    setHasil(null)
    setRendahKepercayaan(null)
    setError(null)
    setSavedInfo(null)
    if (previewURL) URL.revokeObjectURL(previewURL)
    setPreviewURL(null)
    if (kameraRef.current) kameraRef.current.value = ''
    if (galeriRef.current) galeriRef.current.value = ''
  }, [previewURL])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-12 flex flex-col gap-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <Brain size={20} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Deteksi Penyakit
            </h1>
            <p className="text-sm text-slate-700 font-medium">Analisis daun cabai menggunakan AI</p>
          </div>
        </div>
      </div>

      {/* ── Status Model Badge ── */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
        style={{
          background: modelReady ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          border: `1px solid ${modelReady ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`,
          color: modelReady ? '#059669' : '#b45309',
        }}
      >
        <div
          className={`w-2 h-2 rounded-full ${modelReady ? 'animate-pulse-green' : ''}`}
          style={{ background: modelReady ? '#10b981' : '#f59e0b' }}
        />
        {modelReady ? 'Model AI siap digunakan' : 'Memuat model AI…'}
      </div>

      {/* ── Main Grid: 2 kolom Desktop, 1 kolom Mobile ── */}
      {/* items-start: biarkan kolom setinggi kontennya — syarat wajib agar sticky bekerja */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* ══════════════════════════════════════════
            KOLOM KIRI — Upload / Kamera Area
            ══════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">
          <div className="container-hijau-pekat p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-700">📷 Unggah Gambar Daun</h2>

            {/* Area Preview / Placeholder */}
            {previewURL ? (
              <div className="relative">
                <div
                  className="rounded-2xl overflow-hidden animate-scale-in"
                  style={{
                    aspectRatio: '4/3',
                    border: rendahKepercayaan
                      ? '2px solid rgba(245, 158, 11, 0.6)'
                      : '2px solid rgba(52, 211, 153, 0.5)',
                    boxShadow: rendahKepercayaan
                      ? '0 4px 24px rgba(245, 158, 11, 0.2)'
                      : '0 4px 24px rgba(16, 185, 129, 0.15)',
                  }}
                >
                  {/* Overlay blur jika confidence rendah */}
                  {rendahKepercayaan && (
                    <div
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2"
                      style={{
                        backdropFilter: 'blur(6px)',
                        background: 'rgba(254, 243, 199, 0.65)',
                      }}
                    >
                      <span style={{ fontSize: 36 }}>📷</span>
                      <span
                        className="text-xs font-bold text-center px-3"
                        style={{ color: '#92400e' }}
                      >
                        Foto kurang jelas
                      </span>
                    </div>
                  )}
                  <img
                    ref={imgRef}
                    src={previewURL}
                    alt="Preview daun cabai"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    style={ rendahKepercayaan ? { filter: 'blur(2px)' } : {} }
                  />
                </div>
                {!isLoading && (
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 20,
                    }}
                  >
                    <RefreshCw size={11} />
                    Ganti
                  </button>
                )}
              </div>
            ) : (
              <div
                className="upload-zone rounded-2xl flex flex-col items-center justify-center animate-fade-in"
                style={{ aspectRatio: '4/3' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(16, 185, 129, 0.12)' }}
                >
                  <Leaf size={32} color="#10b981" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-bold text-slate-700">Pilih Gambar Daun Cabai</p>
                <p className="text-xs text-slate-600 mt-1 font-medium">Gunakan kamera atau pilih dari galeri</p>
              </div>
            )}

            {/* Input Hidden */}
            <input ref={kameraRef} id="input-kamera" type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" disabled={isLoading} />
            <input ref={galeriRef} id="input-galeri" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isLoading} />

            {/* Tombol Kamera & Galeri */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-kamera"
                onClick={() => kameraRef.current?.click()}
                disabled={isLoading}
                className="flex flex-col items-center gap-2 py-5 rounded-2xl transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1.5px solid rgba(52, 211, 153, 0.4)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <Camera size={24} color="#10b981" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Kamera</span>
              </button>

              <button
                id="btn-galeri"
                onClick={() => galeriRef.current?.click()}
                disabled={isLoading}
                className="flex flex-col items-center gap-2 py-5 rounded-2xl transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1.5px solid rgba(52, 211, 153, 0.4)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <ImagePlus size={24} color="#10b981" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Galeri</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            KOLOM KANAN — Analisis & Hasil
            ══════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">

          {/* Panel Analisis */}
          <div className="container-hijau-pekat p-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))' }}
              >
                <Sparkles size={20} color="#10b981" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Analisis AI</h2>
                <p className="text-xs text-slate-600 font-medium">Tekan tombol untuk memulai</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-5 leading-relaxed font-medium">
              Unggah gambar daun cabai, lalu klik tombol di bawah untuk mendeteksi jenis penyakitnya secara otomatis.
            </p>

            {/* Tombol Analisis */}
            <button
              id="btn-analisis"
              className={`btn-primary w-full transition-all duration-300 ${
                isLoading ? 'bg-slate-400 cursor-not-allowed opacity-80' : ''
              }`}
              onClick={handleAnalisis}
              disabled={!previewURL || isLoading || !modelReady}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menganalisis Daun…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analisis Daun
                </>
              )}
            </button>

            {!modelReady && (
              <p className="text-center text-xs text-amber-600 mt-3 font-medium">
                ⏳ Harap tunggu, model AI sedang dimuat…
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-2xl p-4 animate-slide-up"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <p className="text-sm text-red-600 font-medium text-center">⚠️ {error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="container-hijau-pekat p-8 flex flex-col items-center gap-4 animate-fade-in">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
                style={{ background: 'rgba(16,185,129,0.12)' }}
              >
                <Brain size={32} color="#10b981" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Menganalisis gambar…</p>
                <p className="text-xs text-slate-600 mt-1 font-medium">Model AI sedang memproses</p>
              </div>
            </div>
          )}

          {/* ── Kartu Peringatan: Confidence Rendah (≤ 70%) ── */}
          {rendahKepercayaan && !isLoading && (
            <div
              className="rounded-2xl overflow-hidden animate-slide-up"
              style={{
                border: '1.5px solid rgba(245, 158, 11, 0.5)',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.12), 0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header amber */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  padding: '20px 20px 16px',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ background: 'rgba(245, 158, 11, 0.15)' }}
                  >
                    <span style={{ fontSize: 36 }}>📷</span>
                  </div>
                  <div>
                    <p className="text-base font-black" style={{ color: '#92400e' }}>
                      Foto Kurang Jelas / Buram
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ background: 'white', padding: '16px 20px 20px' }}>
                <p className="text-sm text-slate-600 leading-relaxed text-center mb-4">
                  Model AI tidak dapat mengenali daun dengan cukup yakin. Kemungkinan foto terlalu buram, gelap, jauh, atau bukan gambar daun cabai.
                </p>

                {/* Tips */}
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <p className="text-xs font-semibold text-amber-700 mb-2">💡 Tips foto yang baik:</p>
                  <ul className="text-xs text-amber-800 space-y-1 pl-1">
                    <li>• Pastikan pencahayaan cukup (cahaya alami lebih baik)</li>
                    <li>• Fokuskan kamera langsung pada daun</li>
                    <li>• Jarak kamera 15–30 cm dari daun</li>
                    <li>• Pastikan daun terlihat jelas dan tidak terpotong</li>
                  </ul>
                </div>

                {/* Tombol Foto Ulang */}
                <button
                  id="btn-foto-ulang"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                  }}
                >
                  <RefreshCw size={16} />
                  Foto Ulang
                </button>
              </div>
            </div>
          )}

          {/* ── Kartu Hasil Normal (confidence > 70%) ── */}
          {hasil && !isLoading && (
            <div className="animate-slide-up">
              <HasilKartu hasil={hasil} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeteksiPage
