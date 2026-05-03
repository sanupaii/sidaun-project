import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ambilSemuaRiwayat } from '../utils/db'

export default function DaunAIChatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', content: `Halo ${user?.name || 'Petani'}! Saya DaunAI, asisten pertanian khusus cabai Anda. Ada yang bisa saya bantu terkait lahan atau perawatan cabai hari ini?` }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lahanData, setLahanData] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const messagesEndRef = useRef(null)

  // Tooltip muncul periodik
  useEffect(() => {
    // Tampilkan setelah 3 detik awal
    const timer = setTimeout(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 6000)
    }, 3000)

    // Muncul lagi setiap 20 detik
    const interval = setInterval(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 6000)
    }, 20000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  // Reset chat ketika user berganti akun atau logout
  useEffect(() => {
    setMessages([
      { role: 'model', content: `Halo ${user?.name || 'Petani'}! Saya DaunAI, asisten pertanian khusus cabai Anda. Ada yang bisa saya bantu terkait lahan atau perawatan cabai hari ini?` }
    ])
    if (!user) {
      setIsOpen(false)
    }
  }, [user?._id])

  // Fetch Lahan Data whenever Chat is opened
  useEffect(() => {
    if (isOpen && user) {
      const fetchData = async () => {
        try {
          const historyData = await ambilSemuaRiwayat(user._id)
          
          // Kalkulasi ringkasan
          const totalScans = historyData.length
          const healthyCount = historyData.filter(h => h.kelas === 'Daun sehat').length
          const healthRate = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0
          
          const threatsMap = {}
          historyData.forEach(h => {
            if (h.kelas !== 'Daun sehat') {
              threatsMap[h.kelas] = (threatsMap[h.kelas] || 0) + 1
            }
          })
          const topThreats = Object.entries(threatsMap).map(([name, count]) => `${name} (${count} kasus)`).join(', ') || 'Tidak ada ancaman terdeteksi'

          setLahanData({
            lokasi: user.location?.address || 'Lokasi belum disetel',
            totalPendeteksian: totalScans,
            tingkatKesehatanDaun: `${healthRate}%`,
            penyakitDominan: topThreats
          })
        } catch (error) {
          console.error("Gagal mengambil data lahan:", error)
        }
      }
      fetchData()
    }
  }, [isOpen, user])

  useEffect(() => {
    // Auto-scroll ke bawah saat pesan baru muncul
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Tambahkan pesan user ke UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Opsional, untuk keamanan
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          lahanData: lahanData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'Maaf, terjadi kesalahan pada server DaunAI.' }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { role: 'model', content: 'Maaf, gagal terhubung ke server DaunAI.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col items-end">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="bg-white w-full max-w-sm sm:w-[350px] h-[500px] mb-4 rounded-3xl shadow-2xl flex flex-col border border-emerald-100 overflow-hidden animate-fade-in origin-bottom-right transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-4 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Sparkles size={20} className="text-emerald-50" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide">DaunAI</h3>
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">Asisten Ahli Cabai</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Bot size={32} />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Autentikasi Diperlukan</h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Silakan login atau daftar akun terlebih dahulu untuk bisa mulai berkonsultasi seputar cabai dengan DaunAI.</p>
              <Link to="/login" className="px-6 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors active:scale-95">
                Login Sekarang
              </Link>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      
                      {/* Bubble */}
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        {/* Render simple formatting (newlines) */}
                        {msg.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {/* Render simple bold **text** */}
                            {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j}>{part.slice(2, -2)}</strong>
                              }
                              return part
                            })}
                            {i !== msg.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex w-full justify-start">
                    <div className="flex gap-2 max-w-[85%] flex-row">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                        <Loader2 size={16} className="animate-spin" />
                      </div>
                      <div className="p-3 bg-white text-slate-500 text-xs italic rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2 shadow-sm">
                        DaunAI sedang mengetik...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya soal cabai..." 
                  className="flex-1 py-2.5 px-4 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all border border-transparent focus:border-emerald-300"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors active:scale-95 shadow-md"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </>
          )}

        </div>
      )}

      {/* Floating Tooltip Bubble */}
      {showTooltip && !isOpen && (
        <div className="absolute bottom-20 right-0 bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl animate-bounce-subtle whitespace-nowrap z-[110] border border-white/20 backdrop-blur-sm">
          Tanya asisten DaunAI
          {/* Arrow */}
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-emerald-600 rotate-45"></div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all relative group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-emerald-500"></span>
          </span>
        )}
      </button>
    </div>
  )
}
