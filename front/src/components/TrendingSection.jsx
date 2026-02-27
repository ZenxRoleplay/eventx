import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FestCard from './FestCard'
import { FESTS } from '../lib/data'

export default function TrendingSection({ events = [], loading = false }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  // Use real events if available, otherwise fall back to static FESTS
  const items = events.length > 0 ? events.slice(0, 8) : null
  const isReal = items !== null

  return (
    <section className="bg-[#fafaf9] py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Live Now</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Upcoming Events</h2>
          </div>
          <div className="flex items-center gap-3">
            {[['←', -1], ['→', 1]].map(([arrow, dir]) => (
              <button
                key={arrow}
                onClick={() => scroll(dir)}
                className="hidden md:flex w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-gray-400 items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-sm hover:shadow active:scale-95"
              >
                {arrow}
              </button>
            ))}
            <Link to="/discover" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors ml-2">
              View all →
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-[160px] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-none pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible"
          >
            {isReal
              ? items.map((event, i) => <FestCard key={event.id} event={event} index={i} />)
              : FESTS.map((fest, i) => <FestCard key={fest.id} {...fest} index={i} />)
            }
          </div>
        )}
      </div>
    </section>
  )
}
