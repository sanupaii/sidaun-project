/**
 * src/pages/LandingPage.jsx
 * Halaman utama / landing page SiDaun
 * Menampilkan hero section modern dengan CTA ke halaman deteksi
 */

import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Sparkles, Shield, Zap, ArrowRight, ChevronDown, MapPin, GraduationCap, Activity, Camera, UploadCloud, Cpu, CheckCircle, ArrowDown } from 'lucide-react'

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-');

const features = [
  {
    icon: Sparkles,
    title: 'Deteksi Cerdas AI',
    desc: 'Didukung MobileNetV2 CNN yang dioptimasi khusus untuk performa tinggi di perangkat mobile.',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: Shield,
    title: 'Privasi Terjaga',
    desc: 'Analisis diproses 100% di perangkat Anda. Tidak ada gambar yang dikirim ke server.',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
  },
  {
    icon: Zap,
    title: 'Offline Pertama',
    desc: 'Berfungsi penuh tanpa koneksi internet sebagai Progressive Web App (PWA).',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: Activity,
    title: 'Akurasi 95%+',
    desc: 'Model AI dilatih untuk mengenali 4 kategori kondisi daun cabai dengan tingkat akurasi tinggi.',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
]

const howItWorks = [
  {
    title: 'Ambil Foto',
    desc: 'Ambil foto daun dari kamera atau pilih dari galeri.',
    icon: Camera,
    color: '#10b981'
  },
  {
    title: 'Kirim Gambar',
    desc: 'Gambar dikirim ke sistem model AI untuk dianalisis.',
    icon: UploadCloud,
    color: '#6366f1'
  },
  {
    title: 'Hasil Deteksi',
    desc: 'Sistem memberikan hasil deteksi dan tingkat akurasi.',
    icon: CheckCircle,
    color: '#8b5cf6'
  },
  {
    title: 'Klasifikasi AI',
    desc: 'Model AI melakukan identifikasi jenis penyakit.',
    icon: Cpu,
    color: '#f59e0b'
  },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen md:min-h-[80vh] lg:min-h-[70vh] overflow-hidden">

      {/* ── Decorative Blob Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute animate-blob"
          style={{
            width: 600,
            height: 600,
            top: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute animate-blob"
          style={{
            width: 500,
            height: 500,
            bottom: '5%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute animate-blob"
          style={{
            width: 400,
            height: 400,
            top: '40%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
            animationDelay: '5s',
          }}
        />
      </div>

      {/* ── Hero Section ── */}
      <div className="hero-landing-bg">
        <section className="relative flex flex-col items-center md:justify-start justify-center text-center px-6 pt-16 pb-12 md:pt-12 md:pb-10 min-h-[80vh] md:min-h-[75vh] lg:min-h-[70vh]">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-6 md:mb-4 animate-fade-in"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse-green"
              style={{ background: '#34d399' }}
            />
            Mejuah-Juah · Selamat datang di SiDaun
          </div>

          {/* Floating Leaf Icon */}
          <div
            className="w-16 h-16 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-4 animate-float animate-glow"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 6px 30px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Leaf size={32} color="white" strokeWidth={2.5} />
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5 md:mb-3 animate-slide-up"
            style={{ lineHeight: 1.1, animationDelay: '0.1s' }}
          >
            <span className="text-white drop-shadow-lg">Si</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #34d399, #10b981, #d1fae5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 10px rgba(16,185,129,0.3))',
              }}
            >
              Daun
            </span>
            <br />
            <span className="text-white/90 text-xl md:text-2xl lg:text-4xl font-bold drop-shadow-md">
              Asisten Cerdas Petani Cabai Di Tanah Karo
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm md:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed mb-8 md:mb-6 animate-slide-up"
            style={{ animationDelay: '0.2s', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Deteksi penyakit daun cabai secara instan menggunakan kecerdasan buatan.
            Cukup foto daun Anda AI kami siap menganalisis dalam hitungan detik.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              id="btn-mulai-deteksi"
              onClick={() => navigate('/deteksi')}
              className="btn-premium-emerald px-10 py-5 text-lg shadow-emerald-500/20"
            >
              <Sparkles size={20} />
              Mulai Deteksi Sekarang
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-auto pt-16 md:pt-12 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <span className="text-xs text-white/70 font-bold tracking-wider uppercase">Scroll untuk selengkapnya</span>
            <ChevronDown size={16} className="text-white/60 animate-float" />
          </div>
        </section>
      </div>

      {/* ── Feature Cards (Kenapa SiDaun) ── */}
      <section className="section-dark-emerald-1 px-6 py-20 md:py-32 group">
        <img 
          src="/icons/karo.png" 
          alt="Watermark Karo" 
          className="watermark-karo opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700" 
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <h2 className="premium-title">
                Kenapa SiDaun?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-medium max-w-lg">
                Berbagai kumpulan teknologi cerdas dan sistem pakar yang dirancang khusus 
                untuk membantu meningkatkan produktivitas serta menjaga kesehatan tanaman 
                cabai Anda di Tanah Karo.
              </p>
              <div className="w-full md:w-auto">
                <button 
                  onClick={() => navigate('/about')}
                  className="btn-premium-emerald py-4 px-10 text-lg shadow-emerald-500/20"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </div>

            {/* Right Cards Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {features.map(({ icon: Icon, title, desc, color }, i) => (
                  <div
                    key={title}
                    className="card-premium-dark animate-fade-in"
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-emerald-500/10 border border-emerald-500/20">
                      <Icon size={32} color="#10b981" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-semibold">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Disease Preview Section ── */}
      <section className="section-dark-emerald-2 px-6 py-20 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <h2 className="premium-title">
                Penyakit Cabai
              </h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-medium max-w-lg">
                Model AI kami dilatih secara mendalam untuk mengenali berbagai kategori 
                kondisi daun cabai. Dapatkan diagnosa instan dan langkah penanganan yang tepat.
              </p>
              <div className="w-full md:w-auto">
                <button 
                  onClick={() => navigate('/edukasi')}
                  className="btn-premium-emerald py-4 px-10 text-lg shadow-emerald-500/20"
                >
                  Buka Edukasi
                </button>
              </div>
            </div>

            {/* Right Cards Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[
                  { nama: 'Daun Bercak', image: '/bercak.png' },
                  { nama: 'Daun Keriting', image: '/keriting.png' },
                  { nama: 'Daun Kuning', image: '/kuning.png' },
                  { nama: 'Daun Sehat', image: '/sehat.png' },
                ].map(({ nama, image }, i) => (
                  <Link
                    key={nama}
                    to={`/edukasi/${slugify(nama)}`}
                    className="card-premium-dark group animate-fade-in"
                    style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                  >
                    <div className="mb-6 flex flex-col items-center justify-center relative">
                      <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <img
                        src={image}
                        alt={nama}
                        className="w-24 h-24 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                        style={{ filter: `drop-shadow(0 12px 20px rgba(16,185,129,0.2))` }}
                      />
                    </div>
                    <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{nama}</h3>
                    <button className="btn-premium-emerald w-full py-2.5 text-xs tracking-widest uppercase">Lihat Kategori</button>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="section-dark-emerald-1 px-6 pt-16 md:pt-24 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3 tracking-tight">
            Cara Kerja Model AI
          </h2>
          <p className="text-center text-white/70 font-medium mb-12 text-sm md:text-base">
            Proses deteksi cerdas yang mudah dan cepat
          </p>

          <div className="relative">
            {/* Desktop Connectors (Z-Pattern) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none opacity-40">
              {/* Box 1 -> Box 2 (Top Row) */}
              <div className="absolute top-[25%] left-[50%] -translate-x-1/2">
                <ArrowRight size={24} className="text-emerald-400" />
              </div>
              {/* Box 2 -> Box 3 (Right Side Drop) */}
              <div className="absolute top-[50%] right-[25%] -translate-y-1/2">
                <ArrowDown size={24} className="text-emerald-400" />
              </div>
              {/* Box 3 -> Box 4 (Bottom Row) */}
              <div className="absolute top-[75%] left-[50%] -translate-x-1/2">
                <ArrowRight className="text-emerald-400 rotate-180" size={24} />
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-y-16 md:gap-x-24">
              {howItWorks.map((step, i) => (
                <div
                  key={step.title}
                  className="relative group animate-slide-up"
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  <div className="container-hijau-pekat p-6 flex items-start gap-5 relative z-10 hover:shadow-2xl transition-all duration-300 border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}25` }}
                    >
                      <step.icon size={24} color={step.color} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed font-medium">{step.desc}</p>
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-black shadow-lg">
                      {i === 2 ? 4 : i === 3 ? 3 : i + 1}
                    </div>
                  </div>

                  {/* Mobile Arrow */}
                  {i < howItWorks.length - 1 && (
                    <div className="md:hidden flex justify-center py-4">
                      <ArrowDown size={20} className="text-white/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <button
              id="btn-mulai-deteksi-bottom"
              onClick={() => navigate('/deteksi')}
              className="btn-premium-emerald px-12 py-5 text-lg"
            >
              <Sparkles size={22} />
              Coba Sekarang
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage
