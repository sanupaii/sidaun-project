/**
 * src/components/HasilKartu.jsx
 * Kartu hasil deteksi penyakit daun cabai
 * Menampilkan: gambar, nama kelas, confidence, penyebab, dan penanganan
 * Data sudah disimpan otomatis ke DB (tidak ada tombol simpan)
 */

import { CheckCircle, AlertTriangle, Bug, Zap, Leaf, ChevronRight } from 'lucide-react'

// Konfigurasi tampilan per kelas penyakit
const KELAS_CONFIG = {
  'Daun bercak': {
    Icon: Bug,
    badgeBg: 'rgba(251, 146, 60, 0.15)',
    badgeColor: '#ea580c',
    borderColor: 'rgba(251, 146, 60, 0.4)',
    gradientFrom: '#fff7ed',
    gradientTo: '#ffedd5',
    emoji: '🍂',
  },
  'Daun keriting': {
    Icon: Zap,
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    badgeColor: '#a16207',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    gradientFrom: '#fefce8',
    gradientTo: '#fef9c3',
    emoji: '🌀',
  },
  'Daun kuning': {
    Icon: AlertTriangle,
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeColor: '#dc2626',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    gradientFrom: '#fff1f2',
    gradientTo: '#ffe4e6',
    emoji: '⚠️',
  },
  'Daun sehat': {
    Icon: CheckCircle,
    badgeBg: 'rgba(22, 163, 74, 0.12)',
    badgeColor: '#15803d',
    borderColor: 'rgba(22, 163, 74, 0.35)',
    gradientFrom: '#f0fdf4',
    gradientTo: '#dcfce7',
    emoji: '✅',
  },
}

function HasilKartu({ hasil }) {
  const { kelas, akurasi, penyebab, penanganan, imageBase64 } = hasil
  const config = KELAS_CONFIG[kelas] || KELAS_CONFIG['Daun sehat']
  const { Icon } = config
  const persen = (akurasi * 100).toFixed(1)
  const isSehat = kelas === 'Daun sehat'

  return (
    <div
      className="animate-slide-up rounded-2xl overflow-hidden"
      style={{
        border: `1.5px solid ${config.borderColor}`,
        boxShadow: `0 8px 32px ${config.badgeBg}, 0 2px 8px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Header gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
          padding: '16px 20px 12px',
          borderBottom: `1px solid ${config.borderColor}`,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Thumbnail gambar */}
          {imageBase64 && (
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 72,
                height: 72,
                border: `2px solid ${config.borderColor}`,
              }}
            >
              <img
                src={imageBase64}
                alt="Gambar analisis"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Badge auto-saved kecil */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <div
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: config.badgeBg,
                  color: config.badgeColor,
                  border: `1px solid ${config.borderColor}`,
                }}
              >
                {config.emoji} {kelas}
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 6, background: 'rgba(0,0,0,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${persen}%`,
                    background: config.badgeColor,
                  }}
                />
              </div>
              <span
                className="text-sm font-bold flex-shrink-0"
                style={{ color: config.badgeColor }}
              >
                {persen}%
              </span>
            </div>
            <p
              className="text-xs mt-1 font-bold"
              style={{ color: '#4b5563' }}
            >
              Tingkat keyakinan model
            </p>
          </div>
        </div>
      </div>

      {/* Body: Penyebab & Penanganan */}
      <div style={{ background: 'white', padding: '16px 20px' }}>
        {/* Penyebab */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99, 102, 241, 0.1)' }}
            >
              <Icon size={13} color="#6366f1" />
            </div>
            <h3 className="text-sm font-black text-gray-900">Penyebab</h3>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed pl-8 font-medium">
            {penyebab}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '0 0 16px' }} />

        {/* Penanganan */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: isSehat ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
            >
              <ChevronRight size={13} color={isSehat ? '#16a34a' : '#dc2626'} />
            </div>
            <h3 className="text-sm font-black text-gray-900">Penanganan</h3>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed pl-8 font-medium">
            {penanganan}
          </p>
        </div>

        {/* Auto-save indicator */}
        <div
          className="mt-4 flex items-center gap-1.5 justify-center"
          style={{ opacity: 0.55 }}
        >
          <Leaf size={11} color="#16a34a" />
          <span className="text-xs text-slate-700 font-bold">
            Otomatis tersimpan ke riwayat
          </span>
        </div>
      </div>
    </div>
  )
}

export default HasilKartu
