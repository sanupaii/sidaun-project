/**
 * src/context/SyncContext.jsx
 * React Context untuk mengelola state sinkronisasi offline-to-online
 * 
 * Fitur:
 * - Deteksi status online/offline secara real-time
 * - Hitung jumlah item pending di syncQueue
 * - Auto-trigger sinkronisasi saat kembali online
 * - Expose state ke seluruh komponen via useSync() hook
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { jalankanSync, cekJumlahPending } from '../utils/syncService'

const SyncContext = createContext({
  isOnline: true,
  pendingCount: 0,
  isSyncing: false,
  lastSyncResult: null,
  refreshPending: () => {},
  manualSync: () => {},
})

/**
 * Custom hook untuk mengakses sync state
 * Gunakan di komponen mana saja: const { isOnline, pendingCount } = useSync()
 */
export function useSync() {
  return useContext(SyncContext)
}

/**
 * Provider yang harus membungkus App untuk menyediakan sync state
 */
export function SyncProvider({ children }) {
  // ─── State ────────────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState(null)

  // Ref untuk mencegah multiple sync berjalan bersamaan
  const syncLockRef = useRef(false)

  // ─── Refresh jumlah pending ───────────────────────────────────────────
  const refreshPending = useCallback(async () => {
    try {
      const count = await cekJumlahPending()
      setPendingCount(count)
    } catch (err) {
      console.error('[SiDaun Sync] Gagal menghitung antrian:', err)
    }
  }, [])

  // ─── Fungsi sync utama ────────────────────────────────────────────────
  const doSync = useCallback(async () => {
    // Guard: jangan jalankan jika sudah sedang sync atau offline
    if (syncLockRef.current || !navigator.onLine) return
    
    syncLockRef.current = true
    setIsSyncing(true)
    setLastSyncResult(null)

    try {
      const result = await jalankanSync()
      setLastSyncResult(result)

      // Refresh pending count setelah sync
      await refreshPending()

      // Auto-clear notifikasi sukses setelah 5 detik
      if (result.success && result.synced > 0) {
        setTimeout(() => setLastSyncResult(null), 5000)
      }
    } catch (err) {
      console.error('[SiDaun Sync] Error saat sinkronisasi:', err)
      setLastSyncResult({
        success: false,
        synced: 0,
        failed: 0,
        message: 'Terjadi kesalahan saat sinkronisasi.',
      })
    } finally {
      setIsSyncing(false)
      syncLockRef.current = false
    }
  }, [refreshPending])

  // Manual sync trigger (bisa dipanggil dari UI)
  const manualSync = useCallback(() => {
    if (navigator.onLine) {
      doSync()
    }
  }, [doSync])

  // ─── Event Listeners: online/offline ──────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      console.log('[SiDaun Sync] 🟢 Koneksi online terdeteksi!')
      setIsOnline(true)
      // [KRUSIAL] Auto-trigger sync saat kembali online
      doSync()
    }

    const handleOffline = () => {
      console.log('[SiDaun Sync] 🔴 Koneksi offline terdeteksi!')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cek pending count saat pertama kali mount
    refreshPending()

    // Jika sudah online dan ada pending, coba sync
    if (navigator.onLine) {
      // Delay sedikit agar app selesai render dulu
      const timer = setTimeout(() => {
        cekJumlahPending().then(count => {
          if (count > 0) doSync()
        })
      }, 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [doSync, refreshPending])

  // ─── Provide values ───────────────────────────────────────────────────
  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        isSyncing,
        lastSyncResult,
        refreshPending,
        manualSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}

export default SyncContext
