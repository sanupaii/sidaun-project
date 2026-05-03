import { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { ambilSemuaRiwayat } from '../utils/db'
import { LayoutDashboard, Activity, AlertTriangle, ScanLine, User, LogOut, TrendingUp, ShieldCheck, Calendar, MapPin, Download, Loader2, FileText, Thermometer, Droplets } from 'lucide-react'
import LocationPicker from '../components/LocationPicker'
import WeatherWidget from '../components/WeatherWidget'
import { fetchWeather } from '../utils/weatherApi'
import jsPDF from 'jspdf'
import { toPng } from 'html-to-image'

export default function LahanKuPage() {
  const { user, loading: authLoading, logout, updateLocation } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfWeather, setPdfWeather] = useState({ temp: '--', humidity: '--' })
  const reportRef = useRef(null)

  const downloadLaporanPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      if (user.location?.lat && user.location?.lng) {
        const weatherData = await fetchWeather(user.location.lat, user.location.lng);
        if (weatherData) {
          setPdfWeather({ 
            temp: Math.round(weatherData.main.temp), 
            humidity: weatherData.main.humidity 
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const imgData = await toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: reportRef.current.offsetWidth + 'px',
          height: reportRef.current.offsetHeight + 'px'
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const aspect = reportRef.current.offsetHeight / reportRef.current.offsetWidth;
      const pdfHeight = pdfWidth * aspect;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Laporan_LahanKu_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Gagal men-generate PDF", error);
      alert("Terjadi kesalahan saat mengunduh laporan PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  const handleSaveLocation = async (lat, lng, address) => {
    const result = await updateLocation(lat, lng, address)
    if (result.success) {
      // Refresh logic handled by context
    } else {
      alert("Gagal menyimpan lokasi: " + result.error)
    }
  }

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const data = await ambilSemuaRiwayat(user._id)
        setHistory(data)
      }
      setLoading(false)
    }

    if (!authLoading) {
      fetchHistory()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <div className="animate-pulse text-emerald-800 font-black tracking-widest text-sm uppercase">Menyiapkan LahanKu...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // --- Kalkulasi Data Dashboard ---
  const totalScans = history.length

  const chartCategories = [
    { key: 'Daun sehat', name: 'KONDISI SEHAT', color: '#10b981' },
    { key: 'Daun bercak', name: 'BERCAK DAUN', color: '#f59e0b' },
    { key: 'Daun keriting', name: 'DAUN KERITING', color: '#3b82f6' },
    { key: 'Daun kuning', name: 'VIRUS KUNING', color: '#ef4444' }
  ]

  const healthData = chartCategories.map(cat => ({
    name: cat.name,
    value: history.filter(h => h.kelas === cat.key).length,
    color: cat.color
  }))

  const healthyCount = history.filter(h => h.kelas === 'Daun sehat').length
  const healthRate = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0

  const threatsMap = {}
  history.forEach(h => {
    if (h.kelas !== 'Daun sehat') {
      threatsMap[h.kelas] = (threatsMap[h.kelas] || 0) + 1
    }
  })

  const topThreats = Object.entries(threatsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // --- Logika Tingkatan Kesehatan ---
  const getHealthStatus = (rate) => {
    if (rate >= 70) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <ShieldCheck size={14} /> };
    if (rate >= 50) return { label: 'Kondisi Baik', color: 'text-blue-600', bg: 'bg-blue-50', icon: <TrendingUp size={14} /> };
    if (rate >= 30) return { label: 'Perlu Waspada', color: 'text-amber-600', bg: 'bg-amber-50', icon: <AlertTriangle size={14} /> };
    return { label: 'Kondisi Bahaya', color: 'text-rose-600', bg: 'bg-rose-50', icon: <Activity size={14} /> };
  }
  const healthStatus = getHealthStatus(healthRate);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-12 flex flex-col gap-8 animate-fade-in">

      {/* ── Desktop Header ── */}
      <div className="hidden md:flex items-center justify-between bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/50 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 text-white">
            <LayoutDashboard size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard LahanKu</h1>
            <p className="text-slate-600 font-bold flex items-center gap-2">
              <Calendar size={14} className="text-emerald-500" />
              Monitoring Kesehatan Kebun Anda
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Pengguna</span>
          <span className="text-emerald-700 font-black text-lg flex items-center gap-2">
            <ShieldCheck size={20} /> Premium Member
          </span>
        </div>
      </div>

      {/* ── Profile Card (Mobile Hero) ── */}
      <div className="md:hidden relative pt-12 pb-8 px-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[3rem] shadow-2xl shadow-emerald-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full -ml-12 -mb-12 blur-xl" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-[2.5rem] bg-white p-1 shadow-xl">
            <div className="w-full h-full rounded-[2.2rem] bg-emerald-50 flex items-center justify-center text-emerald-600">
              <User size={40} strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-black tracking-tight leading-none">{user.name}</h2>
            <p className="text-emerald-100 text-sm font-medium mt-2 opacity-80">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="mt-2 px-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
          >
            <LogOut size={16} /> Logout Akun
          </button>
        </div>
      </div>

      {/* ── Weather & Location Section ── */}
      <WeatherWidget
        location={user.location}
        onEditLocation={() => setShowLocationPicker(true)}
      />

      {/* ── Stats Overview Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Scans Card */}
        <div className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ScanLine size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-tighter">Live Data</span>
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Analisis</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{totalScans}</h3>
            <span className="text-sm font-bold text-slate-500">Gambar</span>
          </div>
        </div>

        {/* Health Rate Card */}
        <div className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl ${healthStatus.bg} flex items-center justify-center ${healthStatus.color} group-hover:scale-110 transition-transform`}>
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div className={`flex items-center gap-1 ${healthStatus.color} font-black text-xs uppercase`}>
              {healthStatus.icon} {healthStatus.label}
            </div>
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Skor Kesehatan</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-5xl font-black ${healthStatus.color} tracking-tighter`}>{healthRate}%</h3>
            <span className="text-sm font-bold text-slate-500">Imun Kebun</span>
          </div>
        </div>

        {/* Laporan PDF Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
          <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Dokumen Analisis</p>
          <h4 className="text-xl font-black leading-tight mb-6">Unduh Rangkuman<br />Kesehatan Lahan</h4>
          <button
            onClick={downloadLaporanPDF}
            disabled={isGeneratingPDF || totalScans === 0}
            className={`w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
              isGeneratingPDF || totalScans === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-400 shadow-emerald-500/30'
            }`}
          >
            {isGeneratingPDF ? (
              <><Loader2 size={16} className="animate-spin" /> Menyusun Laporan...</>
            ) : totalScans === 0 ? (
              <><FileText size={16} /> Belum Ada Data</>
            ) : (
              <><Download size={16} /> Download PDF</>
            )}
          </button>
        </div>

      </div>

      {/* ── Detailed Analytics Grid ── */}
      <div className="grid grid-cols-1">
        {/* Pie Chart Panel (Full Width) */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 border border-slate-100">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Kondisi Kumulatif Kebun</h2>
          </div>

          {totalScans > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 h-[350px] relative rounded-[2rem] overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                style={{
                  backgroundColor: '#ffffff',
                  backgroundImage: `
                    linear-gradient(to right, #f1f5f9 2px, transparent 2px),
                    linear-gradient(to bottom, #f1f5f9 2px, transparent 2px)
                  `,
                  backgroundSize: '25px 25px'
                }}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="#0f172a"
                      strokeWidth={2}
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '24px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px 0px rgba(15,23,42,1)', padding: '12px 20px' }}
                      itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Detail Custom */}
              <div className="flex-1 w-full grid grid-cols-1 gap-3">
                {healthData.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-between hover:border-slate-900 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{item.value} <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Kasus</span></div>
                  </div>
                ))}
                <div className="mt-2 p-6 rounded-3xl bg-emerald-950 text-white flex items-center justify-between shadow-xl shadow-emerald-900/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Rasio Kesehatan</span>
                  <span className="text-3xl font-black">{healthRate}%</span>
                </div>
              </div>
            </div>

          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <ScanLine size={32} />
              </div>
              <p className="text-sm font-bold text-slate-400 italic">Belum ada data deteksi yang tersimpan</p>
            </div>
          )}
        </div>

      </div>
      {/* ── Hidden Report Layout (For PDF Generation) ── */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div 
          ref={reportRef} 
          className="bg-slate-50 text-slate-900 p-12 flex flex-col gap-8 relative overflow-hidden" 
          style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-6">
             <div className="flex items-center gap-4">
                <img src="/icons/icon-192.png" alt="SiDaun Logo" className="w-16 h-16 rounded-2xl shadow-sm bg-white p-1" crossOrigin="anonymous" />
                <div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight">SiDaun</h1>
                   <p className="text-emerald-700 font-bold">Laporan Kesehatan Lahan AI</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm font-black text-slate-800 mt-1">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
             </div>
          </div>

          {/* Ringkasan & Cuaca */}
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-3xl border-2 border-slate-200">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Status Kumulatif</h3>
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-12 h-12 rounded-xl ${healthStatus.bg} flex items-center justify-center ${healthStatus.color}`}>
                      {healthStatus.icon}
                   </div>
                   <div>
                      <p className="text-2xl font-black text-slate-900">{healthRate}%</p>
                      <p className={`text-sm font-bold ${healthStatus.color}`}>{healthStatus.label}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                   <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <ScanLine size={20} />
                   </div>
                   <div>
                      <p className="text-xl font-black text-slate-900">{totalScans}</p>
                      <p className="text-xs font-bold text-slate-500">Total Analisis Daun</p>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border-2 border-slate-200">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Cuaca Lahan</h3>
                <div className="flex items-center gap-3 mb-2">
                   <MapPin size={16} className="text-emerald-600" />
                   <p className="text-sm font-bold text-slate-700 line-clamp-2">{user.location?.address || 'Lokasi belum diatur'}</p>
                </div>
                <div className="mt-4 flex gap-4">
                   <div className="bg-blue-50 p-3 rounded-xl flex-1 text-center">
                      <div className="flex justify-center mb-1"><Thermometer size={16} className="text-blue-500"/></div>
                      <p className="text-[10px] font-black text-blue-500 uppercase">Suhu</p>
                      <p className="text-lg font-black text-blue-900">{pdfWeather.temp}°C</p>
                   </div>
                   <div className="bg-emerald-50 p-3 rounded-xl flex-1 text-center">
                      <div className="flex justify-center mb-1"><Droplets size={16} className="text-emerald-500"/></div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase">Kelembapan</p>
                      <p className="text-lg font-black text-emerald-900">{pdfWeather.humidity}%</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Diagram Lingkaran */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Distribusi Kondisi Daun</h3>
             {totalScans > 0 ? (
                <div className="flex items-center gap-8">
                   <div className="w-[200px] h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={healthData}
                               cx="50%"
                               cy="50%"
                               innerRadius={50}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                               stroke="#ffffff"
                               strokeWidth={2}
                               isAnimationActive={false}
                            >
                               {healthData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex-1 grid grid-cols-2 gap-4">
                      {healthData.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                            <div>
                               <p className="text-xs font-black text-slate-700 uppercase">{item.name}</p>
                               <p className="text-lg font-black text-slate-900">{item.value} <span className="text-xs font-bold text-slate-500">Kasus</span></p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="py-10 text-center text-slate-500 font-bold">Belum ada data analisis.</div>
             )}
          </div>

          {/* Foto Terbaru */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 flex-1">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">4 Riwayat Temuan Terakhir</h3>
             {history.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                   {history.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 border border-slate-100 rounded-2xl bg-slate-50 items-center">
                         {item.imageBase64 && (
                           <img src={item.imageBase64} alt={item.kelas} className="w-20 h-20 object-cover rounded-xl shadow-sm" crossOrigin="anonymous" />
                         )}
                         <div>
                            <p className="text-xs font-black text-slate-500 mb-1">{new Date(item.timestamp).toLocaleDateString('id-ID')}</p>
                            <p className="text-sm font-black text-slate-900 leading-tight">{item.kelas}</p>
                            <p className="text-xs font-bold text-emerald-600 mt-1">Akurasi: {item.akurasi ? `${(item.akurasi * 100).toFixed(1)}%` : '-'}</p>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="py-10 text-center text-slate-500 font-bold">Belum ada riwayat gambar.</div>
             )}
          </div>
          
          <div className="mt-auto pt-6 border-t-2 border-emerald-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <img src="/icons/icon-192.png" alt="SiDaun Logo" className="w-8 h-8 rounded-lg" crossOrigin="anonymous" />
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Sistem Deteksi Penyakit Daun Cabai (SiDaun)</p>
                  <p className="text-[9px] font-bold text-slate-500">Dicetak melalui Aplikasi SiDaun - Analisis AI Canggih & Akurat</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 italic">Dokumen ini sah dan di-generate otomatis.</p>
             </div>
          </div>
        </div>
      </div>
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSave={handleSaveLocation}
        initialLocation={user.location}
      />
    </div>
  )
}
