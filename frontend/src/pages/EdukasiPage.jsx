import React, { useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  BookOpen, AlertTriangle, Activity, ShieldCheck, CheckCircle2, 
  ArrowLeft, CloudSun, MapPin, Sprout, Bug, Pill, Target, Stethoscope, Info
} from 'lucide-react'
import { PLANT_DATA } from '../data/plantData'

// Helper untuk membuat slug dari nama kelas (misal: "Daun bercak" -> "daun-bercak")
const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-')

export default function EdukasiPage() {
  const { diseaseId } = useParams()
  const navigate = useNavigate()
  const detailRef = useRef(null)

  // Konversi PLANT_DATA ke array untuk mapping di grid
  const listPenyakit = useMemo(() => {
    return Object.entries(PLANT_DATA).map(([key, value]) => ({
      id: key,
      slug: slugify(key),
      ...value
    }))
  }, [])

  // Cari data yang dipilih berdasarkan slug di URL
  const selected = useMemo(() => {
    if (!diseaseId) return null
    return listPenyakit.find(item => item.slug === diseaseId)
  }, [diseaseId, listPenyakit])

  // Efek Auto Scroll saat detail dipilih
  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selected])

  // ── VIEW: HALAMAN DETAIL (Ketik Item Diklik) ──
  const DetailView = () => {
    if (!selected) return null
    
    return (
      <div ref={detailRef} className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12 flex flex-col gap-6 animate-fade-in scroll-mt-20">
        <button
          onClick={() => navigate('/edukasi')}
          className="flex items-center gap-2 text-slate-500 hover:text-rose-700 transition-colors font-black text-xs uppercase tracking-widest w-fit mb-2 group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Kembali ke Ensiklopedia
        </button>

        <div
          className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-2 animate-scale-in"
          style={{ borderColor: `rgba(0,0,0,0.05)` }}
        >
          {/* Top Banner Detail */}
          <div className="p-8 md:p-12 text-center border-b bg-slate-50 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
             <div className="relative z-10 flex flex-col items-center">
                <span className="text-5xl mb-4 animate-bounce">{selected.emoji}</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{selected.nama}</h2>
                <div className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   Database ID: {selected.id}
                </div>
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
             {/* Deskripsi & Ringkasan */}
             <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                   <Info size={24} />
                </div>
                <div>
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi Kondisi</h4>
                   <p className="text-lg md:text-xl text-slate-700 font-medium italic leading-relaxed">"{selected.deskripsi}"</p>
                </div>
             </div>

             {/* Grid: Penyebab & Penanganan */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100">
                   <div className="flex items-center gap-3 mb-4 text-rose-700">
                      <Bug size={24} />
                      <h4 className="text-sm font-black uppercase tracking-widest">Penyebab Utama</h4>
                   </div>
                   <p className="text-slate-700 font-bold leading-relaxed">{selected.penyebab}</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100">
                   <div className="flex items-center gap-3 mb-4 text-emerald-700">
                      <Stethoscope size={24} />
                      <h4 className="text-sm font-black uppercase tracking-widest">Penanganan Medis</h4>
                   </div>
                   <p className="text-slate-700 font-bold leading-relaxed">{selected.penanganan}</p>
                </div>
             </div>

             {/* Detailed Info Blocks */}
             <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-slate-100 transition-colors">
                   <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
                      <Pill size={28} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Rekomendasi Bahan Aktif / Obat</h4>
                      <p className="text-base text-slate-900 font-black leading-relaxed">{selected.rekomendasiObat}</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-slate-100 transition-colors">
                   <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <ShieldCheck size={28} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Prosedur Pencegahan Preventif</h4>
                      <p className="text-base text-slate-900 font-black leading-relaxed">{selected.pencegahan}</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-slate-100 transition-colors">
                   <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                      <Target size={28} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tindakan Strategis Selanjutnya</h4>
                      <p className="text-base text-slate-900 font-black leading-relaxed">{selected.tindakanLanjut}</p>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Footer Card */}
          <div className="bg-slate-900 p-8 text-center">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Pastikan lahan Anda selalu terpantau</p>
             <button 
              onClick={() => navigate('/deteksi')}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-emerald-600 transition-all active:scale-95"
             >
               Mulai Pemindaian Baru
             </button>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW: HALAMAN MASTER (Grid List) ──
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-12 flex flex-col gap-12 animate-fade-in relative z-10">

      {/* Header Halaman */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Ensiklopedia</h1>
            <p className="text-sm text-slate-500 font-bold tracking-widest uppercase mt-2">Pusat Pengetahuan Agrikultur Tanah Karo</p>
          </div>
        </div>
      </div>

      {/* Render Detail jika ada, jika tidak render Grid */}
      {selected ? (
        <DetailView />
      ) : (
        <>
          {/* ── Section: Regional Intro (Tanah Karo) ── */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-slate-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 grayscale">
                <img src="/icons/karo.png" alt="Karo" className="w-32 h-32" />
             </div>
             <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                   <MapPin size={12} /> Geographic Intelligence
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase leading-[0.9]">
                   Lumbung Cabai <br/><span className="text-emerald-600 italic">Tanah Karo</span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10">
                  Kabupaten Karo merupakan pusat agribisnis terbesar di Sumatra Utara. Terletak di dataran tinggi Bukit Barisan, wilayah ini memiliki karakteristik tanah vulkanik yang kaya akan unsur hara mikro, sangat mendukung pertumbuhan tanaman cabai berkualitas tinggi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                         <CloudSun size={24} />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Iklim Ideal</h4>
                         <p className="text-xs text-slate-500 font-medium">Suhu sejuk (16-27°C) untuk pembentukan klorofil optimal.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                         <Sprout size={24} />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Tanah Vulkanik</h4>
                         <p className="text-xs text-slate-500 font-medium">Kaya unsur hara mikro dari mineral Gunung Sinabung.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* ── Section: Grid Ensiklopedia ── */}
          <div>
            <div className="flex justify-between items-end mb-8">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Modul Analisis</h2>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{listPenyakit.length} Kategori Terdaftar</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listPenyakit.map((item, idx) => (
                <Link
                  key={item.id}
                  to={`/edukasi/${item.slug}`}
                  className="group bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-emerald-50 transition-colors"></div>
                  <div className="relative z-10">
                     <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500 inline-block">{item.emoji}</div>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-tight">{item.nama}</h3>
                     <p className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-3 mb-6 italic">"{item.deskripsi}"</p>
                     <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Detail Modul <ArrowLeft size={12} className="rotate-180" />
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
