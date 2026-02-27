import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CAT_META = {
  Cultural:   { emoji: '🎭', color: '#fef3c7' },
  Technical:  { emoji: '⚡', color: '#ede9fe' },
  Technology: { emoji: '🚀', color: '#ede9fe' },
  Music:      { emoji: '🎵', color: '#fef3c7' },
  Business:   { emoji: '💼', color: '#dbeafe' },
  Finance:    { emoji: '💰', color: '#fefce8' },
  Sports:     { emoji: '🏆', color: '#dcfce7' },
  Gaming:     { emoji: '🎮', color: '#e0e7ff' },
  Fashion:    { emoji: '👗', color: '#fae8ff' },
  Literary:   { emoji: '📚', color: '#ccfbf1' },
  Art:        { emoji: '🎨', color: '#fce7f3' },
  Design:     { emoji: '✏️', color: '#fdf4ff' },
  Festival:   { emoji: '🎪', color: '#fff0f3' },
  Food:       { emoji: '🍕', color: '#fff7ed' },
  Comedy:     { emoji: '😂', color: '#fef9c3' },
  Education:  { emoji: '📖', color: '#f0fdf4' },
}

// Accepts either legacy static props OR a real `event` object from the API
export default function FestCard({ event, name, college, date, category, attendees, events, color, emoji, index = 0 }) {
  const navigate = useNavigate()

  // Normalise to a single shape
  const isReal = !!event
  const title    = isReal ? event.title          : name
  const catLabel = isReal ? (event.category ?? 'Event') : category
  const meta     = CAT_META[catLabel] ?? { emoji: '🎉', color: '#f1f5f9' }
  const cardColor = isReal ? meta.color : (color ?? meta.color)
  const cardEmoji = isReal ? meta.emoji : (emoji ?? meta.emoji)
  const sub      = isReal
    ? `${event.location ?? 'TBD'} · ${new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : `${college} · ${date}`
  const badge    = isReal ? (event.is_free ? '🆓 Free' : `₹${event.price}`) : null
  const handleClick = () => isReal ? navigate(`/events/${event.id}`) : navigate(`/discover?q=${encodeURIComponent(title)}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.015 }}
      style={{ transformStyle: 'preserve-3d' }}
      onClick={handleClick}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)] transition-shadow duration-300 cursor-pointer flex-shrink-0 w-[270px] md:w-auto"
    >
      {/* Poster area */}
      <div
        className="h-[160px] relative flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${cardColor} 0%, #fff 130%)` }}
      >
        {isReal && event.image_url ? (
          <img src={event.image_url} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : null}
        <motion.span
          className="text-[72px] select-none filter drop-shadow-sm relative z-10"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {cardEmoji}
        </motion.span>
        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {catLabel}
        </span>
        {badge && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-[1.05rem] leading-tight mb-1 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">{sub}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {isReal ? (
              <span className="flex items-center gap-1"><span>📅</span> {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
            ) : (
              <>
                <span className="flex items-center gap-1"><span>👥</span> {attendees}</span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="flex items-center gap-1"><span>🗂</span> {events} events</span>
              </>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-orange-500 transition-colors flex items-center justify-center shadow-sm">
            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
