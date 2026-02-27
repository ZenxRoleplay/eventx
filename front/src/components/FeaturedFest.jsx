import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MagneticButton from './MagneticButton'

const CAT_EMOJI = {
  Cultural: '🎭', Technical: '⚡', Technology: '🚀', Music: '🎵',
  Business: '💼', Finance: '💰', Sports: '🏆', Gaming: '🎮',
  Fashion: '👗', Literary: '📚', Art: '🎨', Design: '✏️',
  Festival: '🎪', Food: '🍕', Comedy: '😂', Education: '📖',
}

export default function FeaturedFest({ events = [], loading = false }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const emojiY = useTransform(scrollYProgress, [0, 1], [-20, 20])

  // Pick the first approved real event, or fall back to null (show static)
  const featured = events.length > 0 ? events[0] : null

  const title    = featured ? featured.title       : 'Mood Indigo'
  const location = featured ? (featured.location ?? 'TBD') : 'IIT Bombay, Powai'
  const dateStr  = featured
    ? new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'December 20 – 22, 2025'
  const emoji    = featured ? (CAT_EMOJI[featured.category] ?? '🎉') : '🎭'
  const tag      = featured ? (featured.category ?? 'Event') : "Asia's Largest Cultural Fest"
  const isFree   = featured ? featured.is_free : true
  const price    = featured ? featured.price : 0

  const stats = featured
    ? [
        { n: featured.category ?? '—', l: 'Category' },
        { n: isFree ? 'Free' : `₹${price}`, l: 'Entry' },
        { n: new Date(featured.date) > new Date() ? 'Upcoming' : 'Past', l: 'Status' },
      ]
    : [
        { n: '50,000+', l: 'Attendees' },
        { n: '200+', l: 'Events' },
        { n: '3', l: 'Days' },
        { n: '₹0', l: 'Entry' },
      ]

  return (
    <section ref={ref} className="bg-white py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest">Featured</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
            {loading ? <span className="inline-block w-48 h-8 bg-gray-100 rounded-xl animate-pulse" /> : 'Spotlight Event'}
          </h2>
        </motion.div>

        {loading ? (
          <div className="rounded-[2rem] overflow-hidden bg-gray-100 animate-pulse" style={{ minHeight: '420px' }} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.006 }}
            className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-orange-100"
            style={{ minHeight: '420px' }}
          >
            {featured?.image_url && (
              <img
                src={featured.image_url}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-10"
              />
            )}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-200/25 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-10 lg:p-16">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-sm border border-orange-100 text-orange-600 text-xs font-bold px-4 py-2 rounded-full mb-7 shadow-sm">
                  🔥 {tag}
                </span>
                <h2 className="text-[3.4rem] md:text-[4.5rem] font-bold text-gray-950 tracking-[-0.03em] leading-none mb-4">
                  {title}
                </h2>
                <div className="flex items-center gap-3 text-gray-500 mb-8">
                  <span className="font-medium">{location}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-6 mb-10">
                  {stats.map(({ n, l }) => (
                    <div key={l}>
                      <div className="text-2xl font-bold text-gray-900">{n}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <MagneticButton
                    variant="dark"
                    onClick={() => featured ? navigate(`/events/${featured.id}`) : navigate('/discover')}
                  >
                    <span>Explore Event</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </MagneticButton>
                </div>
              </div>

              <div className="relative flex-shrink-0">
                <motion.div
                  style={{ y: emojiY }}
                  className="w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full flex items-center justify-center shadow-2xl shadow-orange-200/60"
                >
                  <span className="text-[7rem] select-none">{emoji}</span>
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-3 -right-3 w-16 h-16"
                >
                  <div className="w-full h-full rounded-full border-2 border-dashed border-orange-200 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
