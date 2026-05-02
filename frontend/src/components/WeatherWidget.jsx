import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Thermometer, Droplets, Wind, AlertCircle, CheckCircle, Info, MapPin, ShieldCheck, AlertTriangle, Activity, Calendar } from 'lucide-react'
import { fetchWeather, getChiliAdvice, fetchForecast, analyzeRainForecast } from '../utils/weatherApi'

export default function WeatherWidget({ location, onEditLocation }) {
  const [weather, setWeather] = useState(null)
  const [rainStatus, setRainStatus] = useState(null)
  const [advices, setAdvices] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadWeather = async () => {
      if (location?.lat && location?.lng) {
        setLoading(true)
        // Paralel fetch weather and forecast
        const [weatherData, forecastData] = await Promise.all([
          fetchWeather(location.lat, location.lng),
          fetchForecast(location.lat, location.lng)
        ])

        if (weatherData) {
          setWeather(weatherData)
          setAdvices(getChiliAdvice(weatherData))
        }

        if (forecastData) {
          setRainStatus(analyzeRainForecast(forecastData))
        }
        
        setLoading(false)
      }
    }

    loadWeather()
  }, [location])

  if (!location) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 rounded-[3rem] text-white flex flex-col items-center text-center gap-6 shadow-xl shadow-emerald-200">
        <div className="w-20 h-20 rounded-[2.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center">
          <MapPin size={40} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight mb-2">Lokasi Lahan Belum Set</h3>
          <p className="text-emerald-50 text-sm font-medium opacity-80 leading-relaxed">
            Pilih lokasi lahan Anda untuk mendapatkan data cuaca akurat & rekomendasi pemeliharaan cabai otomatis.
          </p>
        </div>
        <button
          onClick={onEditLocation}
          className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          Atur Lokasi Sekarang
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-[3rem] border-2 border-slate-100 flex flex-col items-center gap-4 animate-pulse shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-slate-50" />
        <div className="h-4 w-48 bg-slate-50 rounded-full" />
        <div className="h-3 w-32 bg-slate-50/50 rounded-full" />
      </div>
    )
  }

  const weatherIcon = (size = 48) => {
    if (!weather) return <Sun size={size} />;
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('rain')) return <CloudRain size={size} className="text-blue-500" />;
    if (condition.includes('cloud')) return <Cloud size={size} className="text-slate-400" />;
    return <Sun size={size} className="text-amber-500" />;
  }

  return (
    <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-100 shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col group">
      
      {/* ── Upper Section: Weather & Location ── */}
      <div className="p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 p-6 md:p-10 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          {weatherIcon(120)}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 md:gap-6 text-center sm:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform duration-500 shrink-0">
              {weatherIcon(48)}
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <MapPin size={10} className="text-emerald-600" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate max-w-[100px] md:max-w-[120px] text-emerald-700">
                    {location.address?.split(',')[0] || 'Lokasi Lahan'}
                  </span>
                </div>
                <button 
                  onClick={onEditLocation} 
                  className="px-3 md:px-4 py-1.5 bg-emerald-600 text-white font-black text-[8px] md:text-[9px] uppercase rounded-full hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  Ubah Lokasi
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 md:gap-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    {weather ? Math.round(weather.main.temp) : '--'}°C
                  </h3>
                  <p className="text-base md:text-lg font-bold text-slate-400 capitalize">
                    {weather ? weather.weather[0].description : 'Memuat cuaca...'}
                  </p>
                </div>
                
                {/* ── Rain Forecast Badge ── */}
                {rainStatus && (
                  <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 animate-bounce-subtle ${
                    rainStatus.status === 'rainy' 
                    ? 'bg-blue-50 border-blue-100 text-blue-600' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    {rainStatus.status === 'rainy' ? <CloudRain size={12} /> : <Sun size={12} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {rainStatus.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:gap-8 bg-slate-50/80 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Lembap</p>
                <p className="text-base md:text-lg font-black text-slate-800">{weather ? weather.main.humidity : '--'}%</p>
              </div>
            </div>
            <div className="w-px bg-slate-200 h-8 self-center hidden sm:block" />
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
                <Wind size={20} />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Angin</p>
                <p className="text-base md:text-lg font-black text-slate-800">{weather ? (weather.wind.speed * 3.6).toFixed(1) : '--'}<span className="text-[8px] md:text-[10px] ml-0.5">km/h</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="px-6 md:px-10">
        <div className="h-px bg-slate-100 w-full" />
      </div>

      {/* ── Lower Section: Smart Recommendations ── */}
      <div className="p-6 md:p-10 bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Rekomendasi Agronomis</h4>
            <p className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <Activity size={10} strokeWidth={3} className="animate-pulse" /> Tips Berbasis Cuaca
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {advices.length > 0 ? (
            advices.map((advice, idx) => (
              <div key={idx} className="flex gap-4 md:gap-6 group/item animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 shadow-lg transition-all group-hover/item:scale-110 ${
                  advice.type === 'danger' ? 'bg-rose-500 text-white shadow-rose-200' :
                  advice.type === 'warning' ? 'bg-amber-500 text-white shadow-amber-200' :
                  advice.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                  'bg-blue-500 text-white shadow-blue-200'
                }`}>
                  {advice.type === 'danger' ? <AlertTriangle size={24} /> :
                   advice.type === 'success' ? <CheckCircle size={24} /> :
                   <Info size={24} />}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] ${
                      advice.type === 'danger' ? 'text-rose-600' :
                      advice.type === 'warning' ? 'text-amber-600' :
                      advice.type === 'success' ? 'text-emerald-600' :
                      'text-blue-600'
                    }`}>{advice.title}</h5>
                    {advice.type === 'danger' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
                  </div>
                  <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed max-w-3xl">
                    {advice.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 flex flex-col items-center gap-3 text-center">
              <Droplets size={32} className="text-slate-200 animate-bounce" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Memantau kondisi lingkungan...</p>
            </div>
          )}
        </div>

        {advices.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100/50 flex items-center justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Pantau Tanaman Anda Secara Berkala
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
