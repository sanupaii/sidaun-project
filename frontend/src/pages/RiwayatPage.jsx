/**
 * src/pages/RiwayatPage.jsx
 * Halaman daftar riwayat deteksi yang tersimpan di IndexedDB (via Dexie)
 * Layout: Grid card glassmorphism — md:grid-cols-3 desktop, 1 kolom mobile
 * ⚠️ LOGIKA DEXIE/INDEXEDDB TIDAK DIUBAH SAMA SEKALI
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, History, Clock, AlertCircle, Leaf, RefreshCw, BookOpen, CloudUpload, Loader2 } from 'lucide-react'
import { ambilSemuaRiwayat, hapusRiwayat, hapusSemuaRiwayat, ambilSemuaAntrian, hapusDariAntrian, hapusSemuaAntrian } from '../utils/db'
import { formatTanggal } from '../utils/imageUtils'
import { useSync } from '../context/SyncContext'
import { useAuth } from '../context/AuthContext'
import { hapusRiwayatServer, hapusSemuaRiwayatServer } from '../utils/syncService'

const BADGE_STYLE = {
  'Daun bercak': { bg: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: 'rgba(234,88,12,0.35)', emoji: '🍂' },
  'Daun keriting': { bg: 'rgba(161, 98, 7, 0.1)', color: '#a16207', border: 'rgba(161,98,7,0.35)', emoji: '🌀' },
  'Daun kuning': { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: 'rgba(220,38,38,0.3)', emoji: '⚠️' },
  'Daun sehat': { bg: 'rgba(21, 128, 61, 0.1)', color: '#15803d', border: 'rgba(21,128,61,0.3)', emoji: '✅' },
}

function RiwayatPage() {
  const [daftarRiwayat, setDaftarRiwayat] = useState([])
  const [antreanSync, setAntreanSync] = useState([])
  const [loading, setLoading] = useState(true)
  const [konfirmasiHapusSemua, setKonfirmasiHapusSemua] = useState(false)
  const { pendingCount, isSyncing, isOnline, manualSync, refreshPending } = useSync()
  const { user, token } = useAuth()

  /**
   * Muat riwayat dari IndexedDB saat komponen pertama di-render
   * Membutuhkan user login untuk melihat riwayat
   */
  const muatRiwayat = useCallback(async () => {
    if (!user) {
      setDaftarRiwayat([])
      setAntreanSync([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await ambilSemuaRiwayat(user._id)
      setDaftarRiwayat(data)
      const antrean = await ambilSemuaAntrian(user._id)
      setAntreanSync(antrean)
    } catch (err) {
      console.error('[SiDaun] Gagal memuat riwayat:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    muatRiwayat()
  }, [muatRiwayat])

  // Refresh antrean setiap kali pendingCount dari context berubah (misal setelah sync sukses)
  useEffect(() => {
    const fetchAntrean = async () => {
      if (!user) return;
      try {
        const antrean = await ambilSemuaAntrian(user._id)
        setAntreanSync(antrean)
      } catch (err) {
        console.error('[SiDaun Sync] Gagal memuat antrean sync:', err)
      }
    }
    fetchAntrean()
  }, [pendingCount, user])

  /**
   * Hapus satu item riwayat
   * Juga menghapus item dari antrian sync jika belum sempat terkirim
   */
  const handleHapus = useCallback(async (itemRiwayat) => {
    try {
      // 1. Hapus riwayat utama
      await hapusRiwayat(itemRiwayat.id)
      
      // 2. Cari apakah ada di antrean simpan (sync queue)
      const matchingSyncItem = antreanSync.find(
        antrean => 
          antrean.diseaseType === itemRiwayat.kelas && 
          Math.abs(new Date(antrean.scannedAt).getTime() - new Date(itemRiwayat.timestamp).getTime()) < 5000
      )

      if (matchingSyncItem) {
        await hapusDariAntrian(matchingSyncItem.localId)
        await refreshPending() // Update angka badge di UI
      }

      // 3. Hapus juga dari server jika user login
      if (user && token) {
        await hapusRiwayatServer(token, itemRiwayat.timestamp, itemRiwayat.kelas)
      }

      setDaftarRiwayat(prev => prev.filter(item => item.id !== itemRiwayat.id))
    } catch (err) {
      console.error('[SiDaun] Gagal menghapus riwayat:', err)
    }
  }, [antreanSync, refreshPending, user, token])

  /**
   * Hapus semua riwayat dengan konfirmasi 2-tap
   * Juga mengosongkan antrian sync
   */
  const handleHapusSemua = useCallback(async () => {
    if (!konfirmasiHapusSemua) {
      setKonfirmasiHapusSemua(true)
      setTimeout(() => setKonfirmasiHapusSemua(false), 3000)
      return
    }
    try {
      await hapusSemuaRiwayat()
      await hapusSemuaAntrian()
      await refreshPending()
      
      // Hapus semua data dari server
      if (user && token) {
        await hapusSemuaRiwayatServer(token)
      }
      
      setDaftarRiwayat([])
      setAntreanSync([])
      setKonfirmasiHapusSemua(false)
    } catch (err) {
      console.error('[SiDaun] Gagal menghapus semua riwayat:', err)
    }
  }, [konfirmasiHapusSemua, refreshPending, user, token])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-12 flex flex-col gap-8">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <History size={20} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Riwayat Deteksi
            </h1>
            <p className="text-sm text-slate-700 font-medium">
              {loading
                ? 'Memuat riwayat…'
                : daftarRiwayat.length > 0
                  ? `${daftarRiwayat.length} deteksi tersimpan`
                  : 'Belum ada riwayat'
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-riwayat"
            onClick={muatRiwayat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:bg-slate-100 active:scale-95"
            style={{ color: '#64748b', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>

          <button
            id="btn-sync-data"
            onClick={manualSync}
            disabled={isSyncing || !isOnline || pendingCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
            style={{
              background: (isSyncing || !isOnline || pendingCount === 0) ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.1)',
              color: (isSyncing || !isOnline || pendingCount === 0) ? '#93c5fd' : '#2563eb',
              border: `1px solid ${(isSyncing || !isOnline || pendingCount === 0) ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.3)'}`,
              cursor: (isSyncing || !isOnline || pendingCount === 0) ? 'not-allowed' : 'pointer',
            }}
            title={!isOnline ? 'Tidak ada koneksi internet' : pendingCount === 0 ? 'Semua data sudah tersimpan' : 'Simpan data ke server'}
          >
            {isSyncing ? <Loader2 size={13} className="animate-spin" /> : <CloudUpload size={13} />}
            {isSyncing ? 'Menyimpan...' : `Simpan (${pendingCount})`}
          </button>

          {daftarRiwayat.length > 0 && (
            <button
              id="btn-hapus-semua"
              onClick={handleHapusSemua}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: konfirmasiHapusSemua ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                color: '#dc2626',
                border: `1px solid ${konfirmasiHapusSemua ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
              {konfirmasiHapusSemua ? 'Yakin hapus semua?' : 'Hapus Semua'}
            </button>
          )}
        </div>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="container-hijau-pekat p-4 animate-pulse opacity-60"
            >
              <div className="flex gap-3 items-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-emerald-50 rounded-full w-2/3" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-2 bg-slate-100 rounded-full w-1/3" />
                </div>
              </div>
              <div className="h-1.5 bg-emerald-50 rounded-full w-full" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && (!user || daftarRiwayat.length === 0) && (
        <div className="container-hijau-pekat p-12 flex flex-col items-center justify-center text-center animate-fade-in">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-float"
            style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
          >
            <Leaf size={44} color="#10b981" strokeWidth={1.3} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">
            {!user ? 'Harap Login Dahulu' : 'Belum Ada Riwayat'}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
            {!user 
              ? 'Silakan login untuk menyimpan dan melihat riwayat deteksi daun cabai Anda.' 
              : 'Hasil deteksi akan otomatis tersimpan di sini setelah Anda melakukan analisis daun.'}
          </p>
          
          {!user && (
            <Link to="/login" className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md">
              Login Sekarang
            </Link>
          )}
        </div>
      )}

      {/* ── Daftar Riwayat — Grid Card ── */}
      {!loading && daftarRiwayat.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {daftarRiwayat.map((item, index) => {
            const badge = BADGE_STYLE[item.kelas] || BADGE_STYLE['Daun sehat']
            const persen = (item.akurasi * 100).toFixed(1)

            // Cek apakah item ini belum tersinkronisasi (berdasarkan waktu pembuatan yang berdekatan)
            const isPendingSync = antreanSync.some(
              (antrean) => 
                antrean.diseaseType === item.kelas && 
                Math.abs(new Date(antrean.scannedAt).getTime() - new Date(item.timestamp).getTime()) < 5000
            )

            return (
              <div
                key={item.id}
                className="container-hijau-pekat overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both`,
                  borderColor: `${badge.color}40`,
                }}
              >
                {/* Card Header: Thumbnail */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: 140 }}
                >
                  {item.imageBase64 ? (
                    <img
                      src={item.imageBase64}
                      alt={item.kelas}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: badge.bg }}
                    >
                      <AlertCircle size={32} color={badge.color} />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
                    }}
                  />

                  {/* Badge kelas & status sync di atas thumbnail */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(8px)',
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      <span>{badge.emoji}</span>
                      {item.kelas}
                    </div>
                    
                    {isPendingSync && (
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm"
                        style={{
                          background: 'rgba(59, 130, 246, 0.95)',
                          backdropFilter: 'blur(8px)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                        }}
                      >
                        <CloudUpload size={11} strokeWidth={2.5} />
                        Belum Disimpan
                      </div>
                    )}
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    id={`btn-hapus-${item.id}`}
                    onClick={() => handleHapus(item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      cursor: 'pointer',
                    }}
                    title="Hapus riwayat ini"
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Confidence Bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: 5, background: 'rgba(0,0,0,0.07)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${persen}%`, background: badge.color }}
                      />
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: badge.color }}>
                      {persen}%
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock size={11} color="#4b5563" />
                    <span className="text-xs text-slate-600 font-bold">{formatTanggal(item.timestamp)}</span>
                  </div>

                  {/* Tombol Detail PWA */}
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <Link
                      to={`/edukasi/${item.kelas.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all hover:bg-slate-50"
                      style={{ color: badge.color }}
                    >
                      <BookOpen size={14} strokeWidth={2.5} />
                      Lihat Penanganan
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RiwayatPage
