/**
 * src/pages/AboutPage.jsx
 * Halaman profil akademisi pengembang SiDaun
 * Data: Sanupaii - Mahasiswa Skripsi STMIK Triguna Dharma
 */

import { GraduationCap, BookOpen, MapPin, Leaf, Code2, ExternalLink, User, MessageCircle } from 'lucide-react'

// --- Custom Brand Icon SVGs (Menghindari error lucide-react versi lama) ---
const WhatsAppIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const GithubIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const techStack = [
  { name: 'TensorFlow.js', desc: 'Inferensi CNN di browser', color: '#ff6f00', bg: 'rgba(255,111,0,0.1)' },
  { name: 'MobileNetV2', desc: 'Arsitektur model CNN', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  { name: 'React + Vite', desc: 'Framework UI modern', color: '#61dafb', bg: 'rgba(97,218,251,0.1)' },
  { name: 'Dexie.js', desc: 'IndexedDB riwayat offline', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'PWA', desc: 'Progressive Web App offline-first', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { name: 'Tailwind CSS', desc: 'Styling utility-first', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
]

function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-16 flex flex-col gap-8">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <User size={20} color="white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Tentang Pengembang
          </h1>
          <p className="text-sm text-slate-700 font-medium">Profil akademisi & informasi proyek</p>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <div
        className="container-hijau-pekat overflow-hidden animate-slide-up"
      >
        {/* Banner Gradient */}
        <div
          className="h-32 md:h-40 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}
        >
          {/* Pattern dots */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <div className="absolute top-2 right-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-24 bg-white opacity-5 rounded-full blur-2xl" />

          {/* Leaf decoration */}
          <div className="absolute top-4 right-6 opacity-20">
            <Leaf size={56} color="white" strokeWidth={1} />
          </div>
        </div>

        {/* Avatar — melingkar di luar banner */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12 md:-mt-14 mb-4">
            {/* Avatar Circle */}
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-xl animate-scale-in overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                boxShadow: '0 8px 32px rgba(16,185,129,0.3), 0 0 0 4px white',
              }}
            >
              <img 
                src="/profil.jpeg" 
                alt="Sanupaii Profile" 
                className="w-full h-full object-cover relative z-10"
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(52,211,153,0.3)' }}
              >
                <GraduationCap size={13} />
                Mahasiswa Aktif
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.25)' }}
              >
                <Code2 size={13} />
                Fe/Be Developer
              </div>
            </div>
          </div>

          {/* Nama & Info */}
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">
            Sanupaii
          </h2>

          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <GraduationCap size={15} color="#10b981" />
              <span>Mahasiswa Tingkat Akhir · Sistem Informasi</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <MapPin size={15} color="#10b981" />
              <span>STMIK Triguna Dharma, Medan</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />

          {/* Deskripsi Proyek */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} color="#10b981" />
              <h3 className="text-sm font-bold text-slate-700">Tentang Proyek Skripsi</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Aplikasi <span className="font-bold text-emerald-800">Progressive Web App (PWA)</span> ini
              dikembangkan sebagai bagian dari penelitian skripsi berjudul:
            </p>
            <div
              className="mt-3 p-3 rounded-xl italic text-sm font-black text-slate-800 text-center leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px dashed rgba(52,211,153,0.6)' }}
            >
              "Implementasi Convolutional Neural Network pada Progressive Web App untuk
              Deteksi Penyakit Daun Cabai (Studi Kasus: Kabupaten Karo)"
            </div>
          </div>
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Code2 size={18} color="#10b981" />
          Teknologi yang Digunakan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {techStack.map(({ name, desc, color, bg }) => (
            <div
              key={name}
              className="container-hijau-pekat p-4 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: color }}
                />
              </div>
              <div className="text-sm font-bold text-slate-800">{name}</div>
              <div className="text-xs text-slate-700 mt-0.5 leading-snug font-medium">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── App Info ── */}
      <div
        className="container-hijau-pekat p-6 animate-slide-up"
        style={{ animationDelay: '0.25s' }}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Leaf size={18} color="#10b981" />
          Informasi Aplikasi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Versi', value: '1.0.0' },
            { label: 'Framework', value: 'React 19' },
            { label: 'Model', value: 'MobileNetV2' },
            { label: 'Lisensi', value: 'Akademik' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xs text-slate-500 font-bold mb-1">{label}</div>
              <div className="text-sm font-black text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact Us / Hubungi Saya ── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageCircle size={18} color="#10b981" />
          Hubungi Saya
        </h2>
        <p className="text-sm text-slate-700 mb-4 font-medium">Terhubung melalui platform berikut</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* WhatsApp */}
          <a
            href="https://wa.me/6282277235503"
            target="_blank"
            rel="noopener noreferrer"
            className="container-hijau-pekat p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group no-underline"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <WhatsAppIcon size={24} color="white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-800">WhatsApp</div>
              <div className="text-xs text-slate-500 mt-0.5">Chat langsung</div>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/alex.24434987"
            target="_blank"
            rel="noopener noreferrer"
            className="container-hijau-pekat p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group no-underline"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)' }}
            >
              <InstagramIcon size={24} color="white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-800">Instagram</div>
              <div className="text-xs text-slate-500 mt-0.5">@sanupaii</div>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/sanupaii"
            target="_blank"
            rel="noopener noreferrer"
            className="container-hijau-pekat p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group no-underline"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}
            >
              <GithubIcon size={24} color="white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-800">GitHub</div>
              <div className="text-xs text-slate-500 mt-0.5">@sanupaii</div>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/sanu-ahadi-waruwu-4357ab303"
            target="_blank"
            rel="noopener noreferrer"
            className="container-hijau-pekat p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group no-underline"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
            >
              <LinkedinIcon size={24} color="white" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-slate-800">LinkedIn</div>
              <div className="text-xs text-slate-500 mt-0.5">Sanupaii</div>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </a>
        </div>
      </div>

      {/* ── Footer Note ── */}
      {/* <div
        className="rounded-3xl p-6 text-center animate-fade-in overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }} />
        <div className="relative z-10">
          <p className="text-white font-semibold text-sm md:text-base leading-relaxed">
            Dibuat dengan ❤️ untuk membantu petani cabai Indonesia
          </p>
          <p className="text-emerald-100 text-xs mt-2">
            © 2024 SiDaun · STMIK Triguna Dharma · Kabupaten Karo, Sumatera Utara
          </p>
        </div>
      </div> */}

    </div>
  )
}

export default AboutPage
