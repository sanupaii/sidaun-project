import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, AlertTriangle, Bug, Zap, Leaf, ChevronRight, 
  Info, ExternalLink
} from 'lucide-react'
import { PLANT_DATA } from '../data/plantData'

// Helper untuk membuat slug yang konsisten
const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-')

// Konfigurasi tampilan per tema warna
const THEME_CONFIG = {
  emerald: {
    badgeBg: 'rgba(16, 163, 127, 0.1)',
    badgeColor: '#059669',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gradientFrom: '#f0fdf4',
    gradientTo: '#dcfce7',
  },
  orange: {
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    badgeColor: '#ea580c',
    borderColor: 'rgba(251, 146, 60, 0.4)',
    gradientFrom: '#fff7ed',
    gradientTo: '#ffedd5',
  },
  yellow: {
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    badgeColor: '#a16207',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    gradientFrom: '#fefce8',
    gradientTo: '#fef9c3',
  },
  red: {
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeColor: '#dc2626',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    gradientFrom: '#fff1f2',
    gradientTo: '#ffe4e6',
  },
  green: {
    badgeBg: 'rgba(22, 163, 74, 0.12)',
    badgeColor: '#15803d',
    borderColor: 'rgba(22, 163, 74, 0.35)',
    gradientFrom: '#f0fdf4',
    gradientTo: '#dcfce7',
  },
}

function HasilKartu({ hasil }) {
  const navigate = useNavigate()
  const { kelas, akurasi, imageBase64 } = hasil
  const data = PLANT_DATA[kelas] || PLANT_DATA['Daun sehat']
  const config = THEME_CONFIG[data.warna] || THEME_CONFIG.green
  const persen = (akurasi * 100).toFixed(1)

  return (
    <div
      className="animate-slide-up rounded-[2.5rem] overflow-hidden bg-white"
      style={{
        border: `1.5px solid ${config.borderColor}`,
        boxShadow: `0 20px 40px ${config.badgeBg}, 0 4px 12px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Header Section */}
      <div
        className="p-6 md:p-8 border-b"
        style={{ 
          background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
          borderColor: config.borderColor 
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Thumbnail */}
          {imageBase64 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-125"></div>
              <div 
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-10"
              >
                <img src={imageBase64} alt={kelas} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: config.badgeBg, color: config.badgeColor, border: `1px solid ${config.borderColor}` }}>
              <span className="text-sm">{data.emoji}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{kelas}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tighter">
              {data.nama}
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3">
               <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confidence Score</div>
               <div className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px]">{persen}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section (Brief Description) */}
      <div className="p-6 md:p-8">
         <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
               <Info size={20} />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Analisis Singkat</h4>
               <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                  "{data.deskripsi}"
               </p>
            </div>
         </div>

         <button
           onClick={() => navigate(`/edukasi/${slugify(kelas)}`)}
           className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-rose-800 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95 group"
         >
           Pelajari Lebih Lanjut <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
         </button>

         <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
            <Leaf size={12} className="text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Auto-saved to LahanKu History</span>
         </div>
      </div>
    </div>
  )
}

export default HasilKartu
