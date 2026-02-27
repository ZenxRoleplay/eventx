import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getCityEvents } from '../services/api'

const CATEGORY_EMOJIS = {
  Cultural: '🎭', Technical: '⚡', Sports: '🏆', Music: '🎵',
  Business: '💼', Gaming: '🎮', Fashion: '👗', Literary: '📚',
  Technology: '🔧', Finance: '💰', Design: '✏️', Education: '📚',
}

function EventCard({ event }) {
  const navigate = useNavigate()
  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow cursor-pointer"
    >
      {/* Image / placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-orange-50 to-rose-50 overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">
            {CATEGORY_EMOJIS[event.category] ?? '🎉'}
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {event.category ?? 'Event'}
        </span>
        {/* Free badge */}
        {event.is_free && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold bg-green-500 text-white px-2.5 py-1 rounded-full shadow-sm">
            FREE
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
          <span>📍 {event.location ?? 'TBD'}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>🗓 {dateStr}</span>
        </p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm">
            {event.is_free ? '₹ Free' : `₹ ${event.price}`}
          </span>
          <button className="text-xs font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
            View Details →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Discover() {
  const [events, setEvents]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const q        = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const collegeId = searchParams.get('college') || ''

  useEffect(() => {
    setLoading(true)
    getCityEvents()
      .then((res) => setEvents(res.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = events.filter((e) => {
    const matchQ      = !q || e.title.toLowerCase().includes(q.toLowerCase()) ||
      (e.description ?? '').toLowerCase().includes(q.toLowerCase()) ||
      (e.location ?? '').toLowerCase().includes(q.toLowerCase())
    const matchCat    = !category || (e.category ?? '').toLowerCase() === category.toLowerCase()
    const matchCollege = !collegeId || String(e.college_id) === collegeId
    return matchQ && matchCat && matchCollege
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const val = e.target.elements.search.value.trim()
    const params = {}
    if (val) params.q = val
    if (category) params.category = category
    if (collegeId) params.college = collegeId
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">City</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">City Events in Mumbai</h1>
          <p className="text-gray-500 mt-2">Standalone events happening across the city</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
          <input
            name="search"
            defaultValue={q}
            type="text"
            placeholder="Search events…"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-300 transition-all bg-white"
          />
          <button type="submit" className="bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
            Search
          </button>
          {(q || category) && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 bg-white px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* Active filters */}
        {(q || category) && (
          <div className="flex gap-2 mb-6">
            {q && (
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                🔍 "{q}"
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {CATEGORY_EMOJIS[category] ?? ''} {category}
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-20">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-5xl block mb-4">🔍</span>
            No events found. Try a different search!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
