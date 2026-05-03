/**
 * src/App.jsx
 * Root component aplikasi SiDaun
 * Mengelola: routing via react-router-dom, loading model TF.js, PWA install
 */

import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { loadModel } from './utils/model'
import { ModelContext } from './context/ModelContext'

// Pages
import LandingPage from './pages/LandingPage'
import DeteksiPage from './pages/DeteksiPage'
import RiwayatPage from './pages/RiwayatPage'
import EdukasiPage from './pages/EdukasiPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LahanKuPage from './pages/LahanKuPage'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import MeshBackground from './components/MeshBackground'
import SyncStatusBar from './components/SyncStatusBar'
import DaunAIChatbot from './components/DaunAIChatbot'

// Context
import { SyncProvider } from './context/SyncContext'



function App() {
  const location = useLocation()

  // Status loading model TF.js
  const [modelReady, setModelReady] = useState(false)
  const [modelError, setModelError] = useState(null)

  // PWA Install Prompt state
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    // Tangkap event saat PWA bisa di-install
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  /**
   * Load model TF.js saat aplikasi pertama kali dibuka
   */
  useEffect(() => {
    let isMounted = true

    const inisialisasiModel = async () => {
      try {
        await loadModel()
        if (isMounted) {
          setModelReady(true)
          console.log('[SiDaun] App: model siap digunakan.')
        }
      } catch (err) {
        console.error('[SiDaun] App: gagal memuat model:', err)
        if (isMounted) {
          setModelError('Gagal memuat model AI. Pastikan file model tersedia dan coba refresh.')
        }
      }
    }

    inisialisasiModel()

    return () => {
      isMounted = false
    }
  }, [])

  // Cek apakah halaman saat ini adalah landing page
  const isLanding = location.pathname === '/'

  return (
    <ModelContext.Provider value={{ modelReady }}>
      <SyncProvider>
      <div className="min-h-screen mesh-gradient-bg flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
        {/* ── Background Effects ── */}
        <MeshBackground />


        <ScrollToTop />

        {/* ── Banner Install PWA ── */}
        {installPrompt && (
          <div className="fixed top-0 left-0 w-full z-[100] p-3 bg-emerald-600 text-white flex justify-center items-center gap-4 shadow-xl backdrop-blur-md bg-opacity-90 animate-slide-down">
            <span className="text-sm font-bold tracking-tight">Pasang SiDaun di layar utama Anda</span>
            <button
              className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-black text-xs shadow-lg transform active:scale-95 transition-all"
              onClick={async () => {
                installPrompt.prompt()
                const { outcome } = await installPrompt.userChoice
                if (outcome === 'accepted') setInstallPrompt(null)
              }}
            >
              INSTALL
            </button>
            <button
              onClick={() => setInstallPrompt(null)}
              className="opacity-70 hover:opacity-100 text-xs font-bold"
            >
              NANTI
            </button>
          </div>
        )}

        {/* ── Error Banner Model ── */}
        {modelError && (
          <div className="fixed top-4 left-4 right-4 z-[100] max-w-sm mx-auto animate-bounce-subtle">
            <div className="bg-red-500/95 backdrop-blur-lg text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-red-400/50">
              <div className="bg-white/20 p-2 rounded-xl">⚠️</div>
              <p className="text-xs font-bold leading-tight">{modelError}</p>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <Navbar />

        {/* ── Halaman Konten ── */}
        <main className="flex-1 w-full relative pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/deteksi" element={<DeteksiPage modelReady={modelReady} />} />
            <Route path="/riwayat" element={<RiwayatPage />} />
            <Route path="/edukasi" element={<EdukasiPage />} />
            <Route path="/edukasi/:diseaseId" element={<EdukasiPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/lahanku" element={<LahanKuPage />} />
          </Routes>
        </main>

        {/* ── Footer ── */}
        <Footer />

        {/* ── Sync Status Bar (Offline/Online/Syncing) ── */}
        <SyncStatusBar />

        {/* ── Padding for Mobile Nav ── */}
        <div className="h-20 md:hidden" />

        {/* ── DaunAI Chatbot (Global) ── */}
        <DaunAIChatbot />

        {/* ── Vercel Speed Insights ── */}
        <SpeedInsights />

        {/* ── Vercel Web Analytics ── */}
        <Analytics />
      </div>
      </SyncProvider>
    </ModelContext.Provider>
  )
}

export default App
