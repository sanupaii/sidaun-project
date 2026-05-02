/**
 * src/components/Navbar.jsx
 * Global Navigation — Glassmorphism Sticky Desktop + Android Bottom Bar Mobile
 * Menggunakan react-router-dom NavLink untuk routing
 */

import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, Leaf, History, Info, BookOpen, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/deteksi', label: 'Deteksi', Icon: Leaf },
  { to: '/edukasi', label: 'Edukasi', Icon: BookOpen },
  { to: '/riwayat', label: 'Riwayat', Icon: History },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
            
            {/* Auth Section - Desktop */}
            <div className="ml-2 flex items-center border-l pl-4 border-slate-200/60 relative" ref={menuRef}>
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all duration-300 shadow-sm active:scale-95"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                      <User size={14} strokeWidth={3} />
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                  </button>
                  
                  {/* Dropdown Menu Desktop */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 py-3 z-[60] animate-scale-in origin-top-right overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-100/60 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Akun Anda</p>
                        <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="px-2 space-y-1">
                        <NavLink 
                          to="/lahanku" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          LahanKu
                        </NavLink>
                        
                        <NavLink 
                          to="/about" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Info size={18} />
                          Tentang SiDaun
                        </NavLink>

                        <button 
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 rounded-2xl hover:bg-red-50 transition-colors mt-2"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink to="/login" className="px-5 py-2.5 text-sm font-black text-slate-600 hover:text-emerald-600 transition-all active:scale-95">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="px-6 py-2.5 text-sm font-black bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
                    Daftar
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
          
          {/* Auth Status - Mobile (Top Right - Optional / Badge Only) */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter truncate max-w-[60px]">
                  {user.name}
                </span>
              </div>
            )}
          </div>
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
                <div
                  className="relative flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: 48,
                    height: 32,
                    background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 3 : 2}
                    color={isActive ? '#10b981' : '#64748b'}
                  />
                  {isActive && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                      style={{ background: '#10b981' }}
                    />
                  )}
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-tighter transition-colors duration-200"
                  style={{ color: isActive ? '#10b981' : '#64748b' }}
                >
                  {label}
                </span>
              </NavLink>
            )
          })}

          {/* Special Tab: Akun (Mobile) */}
          <NavLink
            to={user ? "/lahanku" : "/login"}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 active:scale-95"
          >
            <div
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/lahanku') 
                ? 'bg-emerald-500/15' : 'transparent'
              }`}
              style={{ width: 48, height: 32 }}
            >
              <User
                size={20}
                strokeWidth={(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/lahanku') ? 3 : 2}
                color={(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/lahanku') ? '#10b981' : '#64748b'}
              />
              {user && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
              )}
            </div>
            <span
              className="text-[9px] font-black uppercase tracking-tighter"
              style={{ color: (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/lahanku') ? '#10b981' : '#64748b' }}
            >
              {user ? 'Akun' : 'Masuk'}
            </span>
          </NavLink>
        </div>
      </nav>
    </>
  )
}

export default Navbar
