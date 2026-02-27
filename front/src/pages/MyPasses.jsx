import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getMyPasses, getEvent } from '../services/api'

function PassCard({ pass }) {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    getEvent(pass.event_id).then((r) => setEvent(r.data)).catch(() => {})
  }, [pass.event_id])

  const dateStr = new Date(pass.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
    >
      {/* Top  */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">EventX Pass</p>
          <h3 className="text-white font-bold text-lg leading-tight">
            {event ? event.title : 'Loading…'}
          </h3>
          {event && <p className="text-gray-400 text-xs mt-1">📍 {event.location ?? 'TBD'}</p>}
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${
          pass.payment_status === 'free'
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        }`}>
          {pass.payment_status === 'free' ? 'FREE' : pass.payment_status.toUpperCase()}
        </span>
      </div>

      {/* Bottom */}
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Pass Code</p>
          <p className="font-mono font-bold text-gray-900 text-base tracking-widest bg-gray-100 px-3 py-2 rounded-xl">
            {pass.pass_code}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Registered</p>
          <p className="text-sm font-medium text-gray-700">{dateStr}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function MyPasses() {
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getMyPasses()
      .then((r) => setPasses(r.data))
      .catch(() => setError('Failed to load passes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Wallet</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">My Passes</h1>
          <p className="text-gray-500 mt-2">All your registered event passes</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-36 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : passes.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🎫</span>
            <p className="text-gray-500 mb-4">No passes yet.</p>
            <Link to="/discover" className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors inline-block">
              Discover Events →
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {passes.map((pass) => <PassCard key={pass.id} pass={pass} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
