import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Mail, Lock, User, KeyRound, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()

      if (data.success) {
        setStep(2)
      } else {
        setError(data.error || 'Gagal mengirim OTP')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()

      if (data.success) {
        login(data.user, data.token)
        setLoading(false)
        setShowSuccess(true)
        
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setLoading(false)
        setError(data.error || 'Verifikasi gagal')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 md:p-10 glass-panel rounded-[2.5rem] md:rounded-[3rem] animate-slide-up shadow-2xl relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
          <Leaf size={32} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          {step === 1 ? 'Daftar Akun Baru' : 'Verifikasi Email'}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {step === 1 
            ? 'Bergabunglah untuk menyimpan riwayat deteksi kebun cabai Anda.' 
            : `Masukkan 6 digit kode OTP yang dikirimkan ke ${email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Petani Modern"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
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
                minLength="6"
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
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>Lanjut <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 text-center">Kode OTP</label>
            <div className="relative max-w-[200px] mx-auto">
              <KeyRound className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                maxLength="6"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-center text-lg font-bold tracking-[0.5em]"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>Verifikasi <CheckCircle2 size={18} /></>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-slate-500 hover:text-slate-800"
          >
            Kembali edit email
          </button>
        </form>
      )}

      {step === 1 && (
        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <NavLink to="/login" className="text-emerald-600 font-bold hover:underline">
            Login di sini
          </NavLink>
        </p>
      )}

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
                  <h3 className="text-2xl font-black text-slate-900">Akun Terverifikasi!</h3>
                  <p className="text-sm text-slate-600 mt-2">Pendaftaran Anda berhasil. Selamat bergabung di SiDaun!</p>
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
