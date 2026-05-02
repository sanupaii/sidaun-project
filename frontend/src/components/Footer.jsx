import { useNavigate } from 'react-router-dom'
import { Leaf, GraduationCap, MapPin } from 'lucide-react'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer
      className="w-full mt-auto border-t z-10 pb-20 md:pb-0 section-dark-emerald-2"
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Leaf size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-white">SiDaun</span>
            <div className="w-[1.5px] h-4 bg-white/20 mx-1" />
            <div className="flex items-center gap-1.5 cursor-default group">
              <img
                src="/icons/karo.png"
                alt="Logo Kabupaten Karo"
                className="w-5 h-auto object-contain drop-shadow-sm"
              />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-tighter">Kab. Karo</span>
            </div>
          </div>
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            Aplikasi deteksi penyakit daun cabai berbasis AI untuk mendukung petani Tanah Karo.
          </p>
          <p className="text-xs text-white/40">© 2026 SiDaun. Hak cipta dilindungi.</p>
        </div>

        {/* Navigasi */}
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest text-[11px]">Navigasi</h3>
          <ul className="flex flex-col gap-2">
            {[
              { label: 'Beranda', path: '/' },
              { label: 'Deteksi AI', path: '/deteksi' },
              { label: 'Edukasi', path: '/edukasi' },
              { label: 'Riwayat', path: '/riwayat' },
              { label: 'Tentang', path: '/about' },
            ].map(({ label, path }) => (
              <li key={label}>
                <button
                  onClick={() => navigate(path)}
                  className="text-sm text-white/60 hover:text-emerald-400 transition-all duration-200 font-semibold"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Proyek */}
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest text-[11px]">Informasi</h3>
          <ul className="flex flex-col gap-3 text-xs text-white/70 font-medium">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <GraduationCap size={14} color="#34d399" />
              </div>
              Mahasiswa Tingkat Akhir · Sistem Informasi
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MapPin size={14} color="#34d399" />
              </div>
              STMIK Triguna Dharma, Medan
            </li>
            <li className="flex items-start gap-3 leading-relaxed">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Leaf size={14} color="#34d399" />
              </div>
              Studi Kasus Kabupaten Karo, Sumatera Utara
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      {/* <div
        className="border-t px-6 py-4 text-center text-xs text-slate-400"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        Dibuat dengan ❤️ untuk petani cabai Indonesia · Didukung TensorFlow.js + MobileNetV2 CNN
      </div> */}
    </footer>
  )
}

export default Footer
