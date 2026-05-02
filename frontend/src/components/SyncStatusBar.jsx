/**
 * src/components/SyncStatusBar.jsx
 * Komponen floating status bar untuk menampilkan status sinkronisasi
 * 
 * States:
 * - Offline Mode → Banner kuning/amber
 * - Pending Sync → Badge dengan jumlah antrean
 * - Syncing → Animasi loading
 * - Sync Success → Toast hijau (auto-dismiss)
 * - Sync Failed → Toast merah
 */

import { useSync } from '../context/SyncContext'
import { Wifi, WifiOff, CloudUpload, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

function SyncStatusBar() {
  const { isOnline, pendingCount, isSyncing, lastSyncResult, manualSync } = useSync()

  // Jika online, tidak ada pending, tidak sync, dan tidak ada result → tidak render apa-apa
  if (isOnline && pendingCount === 0 && !isSyncing && !lastSyncResult) {
    return null
  }

  return (
    <div
      className="fixed bottom-24 md:bottom-6 left-4 right-4 z-[90] flex flex-col items-center gap-2 pointer-events-none"
      style={{ maxWidth: 420, margin: '0 auto' }}
    >
      {/* ── Offline Banner ── */}
      {!isOnline && (
        <div
          className="w-full pointer-events-auto animate-slide-up"
          style={{
            background: 'rgba(245, 158, 11, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <WifiOff size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white tracking-tight">Mode Offline</p>
              <p className="text-xs font-semibold text-white/80">
                Deteksi tetap berjalan. Data akan disimpan ke server saat online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Syncing Animation ── */}
      {isSyncing && (
        <div
          className="w-full pointer-events-auto animate-slide-up"
          style={{
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <Loader2 size={18} color="white" strokeWidth={2.5} className="animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white tracking-tight">Menyimpan Data...</p>
              <p className="text-xs font-semibold text-white/80">
                Mengunggah data deteksi ke server
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sync Success Toast ── */}
      {lastSyncResult && lastSyncResult.success && lastSyncResult.synced > 0 && (
        <div
          className="w-full pointer-events-auto animate-slide-up"
          style={{
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <CheckCircle size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white tracking-tight">Data Berhasil Disimpan!</p>
              <p className="text-xs font-semibold text-white/80">
                {lastSyncResult.synced} deteksi berhasil diunggah ke server
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sync Failed Toast ── */}
      {lastSyncResult && !lastSyncResult.success && (
        <div
          className="w-full pointer-events-auto animate-slide-up"
          style={{
            background: 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <AlertCircle size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white tracking-tight">Data Gagal Disimpan</p>
              <p className="text-xs font-semibold text-white/80">
                {lastSyncResult.message}
              </p>
            </div>
            <button
              onClick={manualSync}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
              title="Coba lagi"
            >
              <RefreshCw size={16} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SyncStatusBar
