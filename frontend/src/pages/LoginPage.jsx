import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hydrateHistory } from '../utils/syncService'
import { Leaf, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.success) {
        login(data.user, data.token)
        // Jalankan sinkronisasi history dari server ke lokal
        hydrateHistory(data.token, data.user._id)
        
        setLoading(false)
        setShowSuccess(true)
        
        // Jeda 1.5 detik agar user bisa melihat modal sukses
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setLoading(false)
        setError(data.error || 'Login gagal')
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError('Terjadi kesalahan koneksi')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 md:p-10 glass-panel rounded-[2.5rem] md:rounded-[3rem] animate-slide-up shadow-2xl relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
          <Leaf size={32} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Selamat Datang Kembali</h1>
        <p className="text-sm text-slate-500 mt-2">Masuk untuk menyimpan dan memantau deteksi tanaman Anda.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md flex justify-center items-center gap-2 mt-6"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Belum punya akun?{' '}
        <NavLink to="/register" className="text-emerald-600 font-bold hover:underline">
          Daftar di sini
        </NavLink>
      </p>
      
      {/* ── Status Modal Overlay ── */}
      {(loading || showSuccess) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-scale-in flex flex-col items-center text-center gap-6">
            {showSuccess ? (
              <>
                <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                  <CheckCircle2 size={60} strokeWidth={2.5} className="animate-bounce-short" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Login Berhasil!</h3>
                  <p className="text-sm text-slate-600 mt-2">Selamat datang kembali! Menyiapkan kebun Anda...</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Loader2 size={60} strokeWidth={2.5} className="animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Memproses...</h3>
                  <p className="text-sm text-slate-500 mt-2">Mohon tunggu sebentar</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
