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

      {/* ── Section 1: Arsitektur Cerdas (The Engine) ── */}
      <section className="relative px-6 py-24 md:py-40 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                <Cpu size={14} /> Core Engine Architecture
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9] uppercase">
                Otak Cerdas <br /><span className="text-emerald-600">Dibalik Layar</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                SiDaun bukan sekadar aplikasi kamera. Di dalamnya terdapat arsitektur Neural Network
                yang telah dioptimasi khusus untuk mengenali pola mikroskopis pada daun cabai
                dengan kecepatan pemrosesan kurang dari 150 milidetik.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-emerald-600 font-black text-2xl mb-1">MobileNetV2</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Base Architecture</div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-emerald-600 font-black text-2xl mb-1">Edge AI</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">On-Device Processing</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full"></div>
              <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100 rotate-2 group hover:rotate-0 transition-transform duration-700">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Activity size={24} />
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-xs uppercase">Live Status</div>
                      <div className="text-white font-mono text-lg">System Active</div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="h-32 w-full flex items-end gap-1">
                      {[40, 70, 45, 90, 65, 80, 30, 60, 85, 50].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/30 rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Heritage x High-Tech (Tanah Karo) ── */}
      <section className="relative px-6 py-24 bg-slate-950 overflow-hidden group">
        <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110">
          <img src="/icons/karo.png" alt="Karo Pattern" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 py-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.85] uppercase">
              Presisi Digital <br /><span className="text-emerald-500">Tanah Karo</span>
            </h2>
            <p className="text-slate-300 text-xl font-medium leading-relaxed mb-12">
              Kami menggabungkan kearifan lokal petani Tanah Karo dengan presisi data digital.
              AI SiDaun dilatih menggunakan ribuan sampel daun dari ladang Karo untuk memastikan
              setiap diagnosa relevan dengan kondisi tanah dan iklim lokal.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">Kec. Kabanjahe</span>
              <span className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">Kec. Berastagi</span>
              <span className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">Kec. Tigapanah</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Lab Diagnostik Digital ── */}
      <section className="relative px-6 py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase leading-none">
              Lab <span className="text-emerald-600 italic">Diagnostik</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg font-bold">Database pengetahuan penyakit cabai terlengkap dalam genggaman Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { nama: 'Bercak', image: '/bercak.png', acc: '98%', color: 'emerald' },
              { nama: 'Keriting', image: '/keriting.png', acc: '95%', color: 'amber' },
              { nama: 'Kuning', image: '/kuning.png', acc: '94%', color: 'rose' },
              { nama: 'Sehat', image: '/sehat.png', acc: '99%', color: 'emerald' },
            ].map(({ nama, image, acc, color }, i) => (
              <div key={nama} className="group p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acc Level</div>
                  <div className="text-emerald-600 font-black text-xs tracking-tighter">{acc}</div>
                </div>
                <div className="flex justify-center mb-10">
                  <img src={image} alt={nama} className="w-24 h-24 object-contain group-hover:scale-125 transition-transform duration-700 drop-shadow-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight text-center">{nama}</h3>
                <button onClick={() => navigate('/edukasi')} className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">Analisis Modul</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Transformasi 4.0 ── */}
      <section className="px-6 py-24 md:py-40 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-black uppercase tracking-widest text-xs">Efisiensi Lahan</h4>
                    <Zap size={20} className="text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Respon Tradisional</div>
                      <div className="text-white font-bold italic">2-3 Hari Kerja</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40">
                      <div className="flex justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Respon SiDaun AI</div>
                      <div className="text-white font-black text-xl italic">0.1 Detik Instan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-white">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
                Saatnya <br />Beralih Ke <br /><span className="text-slate-950">Presisi</span>
              </h2>
              <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-12">
                Jangan biarkan penyakit menyebar karena lambatnya diagnosa.
                Wujudkan pertanian yang lebih produktif, efektif, dan berbasis data bersama SiDaun.
              </p>
              <button
                onClick={() => navigate('/deteksi')}
                className="px-12 py-6 bg-white text-emerald-600 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4"
              >
                Mulai Sekarang <ArrowRight strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

export default LandingPage
