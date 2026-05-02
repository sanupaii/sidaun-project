/**
 * src/components/Navbar.jsx
 * Global Navigation — Glassmorphism Sticky Desktop + Android Bottom Bar Mobile
 * Menggunakan react-router-dom NavLink untuk routing
 */

import { NavLink, useLocation } from 'react-router-dom'
import { Home, Leaf, History, Info, BookOpen } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/deteksi', label: 'Deteksi', Icon: Leaf },
  { to: '/edukasi', label: 'Edukasi', Icon: BookOpen },
  { to: '/riwayat', label: 'Riwayat', Icon: History },
  { to: '/about', label: 'About', Icon: Info },
]

function Navbar() {
  const location = useLocation()

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP — Sticky Glassmorphism Top Navbar
          Tampil pada lebar layar md (≥768px) ke atas
          ══════════════════════════════════════════ */}
      <header className="fixed top-0 z-50 w-full glass-nav">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Brand & Region Section */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className="flex items-center gap-2 group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <Leaf size={18} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg text-slate-900 tracking-tight">SiDaun</span>
                {/* <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">Deteksi Penyakit Cabai</span> */}
              </div>
            </NavLink>

            {/* Vertical Divider */}
            <div className="w-[1.5px] h-8 bg-slate-300/80 rounded-full" />

            {/* Region Brand (Tanah Karo) */}
            <div className="flex items-center gap-2">
              <img
                src="/icons/karo.png"
                alt="Logo Kabupaten Karo"
                className="w-7 h-auto object-contain drop-shadow-sm"
              />
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Kabupaten</span>
                <span className="text-sm font-black text-slate-900 tracking-tight">Karo</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, Icon }) => {
              const isActive = to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to)

              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                    transition-all duration-200
                    ${isActive
                      ? 'text-emerald-700'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }
                  `}
                  style={isActive ? {
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(52,211,153,0.3)',
                  } : {}}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse-green"
                      style={{ background: '#10b981' }}
                    />
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE — Fixed Bottom Navigation Bar
          Disembunyikan pada lebar layar md ke atas
          Gaya Android native bottom navigation
          ══════════════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav-bottom">
        <div
          className="flex w-full"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {navItems.map(({ to, label, Icon }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to)

            return (
              <NavLink
                key={to}
                to={to}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 active:scale-95"
              >
                {/* Icon pill — aktif menyala */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: 48,
                    height: 32,
                    background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    color={isActive ? '#10b981' : '#94a3b8'}
                  />
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white"
                      style={{ background: '#10b981' }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-[10px] font-semibold transition-colors duration-200"
                  style={{ color: isActive ? '#10b981' : '#94a3b8' }}
                >
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Navbar
