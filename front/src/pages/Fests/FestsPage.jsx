import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getFests, getColleges } from '../../services/api'

// ─── Inline FestCard ─────────────────────────────────────────────────────────

function FestCard({ fest, collegeName, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/fest/${fest.slug}`}
        className="block group bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow"
      >
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-rose-100 overflow-hidden">
          {fest.banner_url ? (
            <img
              src={fest.banner_url}
              alt={fest.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl select-none">🎪</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Status pill */}
          <span
            className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              fest.status === 'live' ? 'bg-green-500 text-white' : 'bg-gray-200/90 text-gray-600'
            }`}
          >
            {fest.status === 'live' ? '● Live' : 'Draft'}
          </span>

          {/* Logo */}
          {fest.logo_url && (
            <img
              src={fest.logo_url}
              alt={`${fest.name} logo`}
              className="absolute bottom-3 left-4 w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md"
            />
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-orange-600 transition-colors">
            {fest.name}
          </h3>
          {fest.tagline && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{fest.tagline}</p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-400">
            <span>🏛️ {collegeName ?? 'Mumbai'}</span>
            <span>{fest.event_count ?? 0} event{fest.event_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FestsPage() {
  const [fests,   setFests]   = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams]        = useSearchParams()
  const collegeFilter         = searchParams.get('college')

  useEffect(() => {
    Promise.all([getFests(), getColleges()])
      .then(([festsRes, collegesRes]) => {
        setFests(festsRes.data || [])
        setColleges(collegesRes.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const collegeMap = Object.fromEntries(colleges.map((c) => [c.id, c.name]))

  const filtered = collegeFilter
    ? fests.filter((f) => String(f.college_id) === collegeFilter)
    : fests

  const activeCollegeName = collegeFilter ? collegeMap[Number(collegeFilter)] : null

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest">Fests</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">College Fests in Mumbai</h1>
          <p className="text-gray-500 mt-2">
            Multi-day cultural, technical, and sports fests from Mumbai's top colleges
          </p>
        </div>

        {/* Active college filter pill */}
        {activeCollegeName && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full">
              🏛️ {activeCollegeName}
            </span>
            <Link to="/fests" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Clear ✕
            </Link>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <span className="text-5xl block mb-4">🎪</span>
            <p className="text-base">No fests found. Check back soon!</p>
            {activeCollegeName && (
              <Link to="/fests" className="mt-4 inline-block text-sm font-medium text-orange-500 hover:underline">
                View all fests →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((fest, i) => (
              <FestCard
                key={fest.id}
                fest={fest}
                collegeName={collegeMap[fest.college_id]}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
