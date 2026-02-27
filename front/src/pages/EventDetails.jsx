import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getEvent, registerPass } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [event, setEvent]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [regLoading, setRegLoading] = useState(false)
  const [regDone, setRegDone]     = useState(false)
  const [regError, setRegError]   = useState('')
  const [error, setError]         = useState('')

  useEffect(() => {
    getEvent(id)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRegister = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    setRegLoading(true)
    setRegError('')
    try {
      await registerPass(id)
      setRegDone(true)
    } catch (err) {
      setRegError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setRegLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
    </div>
  )

  if (error || !event) return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center gap-4">
      <span className="text-5xl">😕</span>
      <p className="text-gray-500">{error || 'Event not found'}</p>
      <Link to="/discover" className="text-orange-500 font-semibold hover:underline">← Back to Discover</Link>
    </div>
  )

  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />

      {/* Hero image / banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-100 via-rose-50 to-violet-100 overflow-hidden">
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] p-8 md:p-10"
        >
          {/* Category + status */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-full">
              {event.category ?? 'Event'}
            </span>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              event.status === 'approved'
                ? 'bg-green-50 text-green-600 border border-green-100'
                : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
            }`}>
              {event.status}
            </span>
            {event.is_free && (
              <span className="text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-100 px-3 py-1.5 rounded-full">
                FREE
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{event.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-5 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <span className="flex items-center gap-2">📍 {event.location ?? 'TBD'}</span>
            <span className="flex items-center gap-2">🗓 {dateStr}</span>
            {event.time && <span className="flex items-center gap-2">⏰ {event.time}</span>}
            <span className="flex items-center gap-2">💳 {event.is_free ? 'Free entry' : `₹${event.price}`}</span>
            {event.college_name && <span className="flex items-center gap-2">🏛️ {event.college_name}</span>}
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 text-lg mb-3">About this event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Register section */}
          {event.status === 'approved' && (
            <div className="bg-gray-50 rounded-2xl p-6">
              {regDone ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">🎉</span>
                  <p className="font-semibold text-gray-900 mb-1">You're registered!</p>
                  <p className="text-sm text-gray-500 mb-4">Check your pass in <Link to="/my-passes" className="text-orange-500 font-semibold hover:underline">My Passes</Link></p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 text-xl">{event.is_free ? 'Free' : `₹${event.price}`}</p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {regError && <p className="text-sm text-red-500">{regError}</p>}
                    <button
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="bg-gray-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-gray-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {regLoading ? 'Registering…' : isLoggedIn ? 'Register Now' : 'Sign in to Register'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <Link to="/discover" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Discover
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
