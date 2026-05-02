import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Cek token saat aplikasi dimuat
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const data = await res.json()
          if (data.success) {
            setUser(data.user)
          } else {
            // Token tidak valid
            logout()
          }
        } catch (error) {
          console.error('Error fetching user', error)
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [token])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('token', jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const updateLocation = async (lat, lng, address) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/auth/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lat, lng, address })
      })
      const data = await res.json()
      if (data.success) {
        setUser(prev => ({ ...prev, location: data.location }))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      console.error('Error updating location', error)
      return { success: false, error: 'Network Error' }
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    updateLocation,
    loading
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
