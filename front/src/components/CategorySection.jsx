import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/data'

const CAT_STYLES = {
  Cultural:   { from: '#fff0f3', to: '#ffe4e6', emoji: '🎭' },
  Technical:  { from: '#f5f3ff', to: '#ede9fe', emoji: '⚡' },
  Technology: { from: '#f5f3ff', to: '#ede9fe', emoji: '🚀' },
  Sports:     { from: '#f0fdf4', to: '#dcfce7', emoji: '🏆' },
  Music:      { from: '#fffbeb', to: '#fef3c7', emoji: '🎵' },
  Business:   { from: '#eff6ff', to: '#dbeafe', emoji: '💼' },
  Finance:    { from: '#fefce8', to: '#fef9c3', emoji: '💰' },
  Gaming:     { from: '#f5f3ff', to: '#e0e7ff', emoji: '🎮' },
  Fashion:    { from: '#fdf4ff', to: '#fae8ff', emoji: '👗' },
  Literary:   { from: '#f0fdfa', to: '#ccfbf1', emoji: '📚' },
  Art:        { from: '#fdf4ff', to: '#fce7f3', emoji: '🎨' },
  Design:     { from: '#fdf4ff', to: '#fae8ff', emoji: '✏️' },
  Festival:   { from: '#fff0f3', to: '#ffe4e6', emoji: '🎪' },
  Food:       { from: '#fff7ed', to: '#fef3c7', emoji: '🍕' },
  Comedy:     { from: '#fefce8', to: '#fef9c3', emoji: '😂' },
  Education:  { from: '#f0fdf4', to: '#dcfce7', emoji: '📖' },
}

export default function CategorySection({ events = [] }) {
  // Build live counts from real events, grouped by category
  const liveCounts = {}
  events.forEach((e) => {
    if (e.category) liveCounts[e.category] = (liveCounts[e.category] || 0) + 1
  })

  // Merge static category list with live counts
  const hasRealData = events.length > 0
  const allCategoryNames = hasRealData
    ? [...new Set([...CATEGORIES.map((c) => c.name), ...Object.keys(liveCounts)])]
    : CATEGORIES.map((c) => c.name)

  const cats = allCategoryNames
    .map((name) => {
      const style  = CAT_STYLES[name] ?? { from: '#f1f5f9', to: '#e2e8f0', emoji: '🎉' }
      const count  = hasRealData ? (liveCounts[name] || 0) : (CATEGORIES.find((c) => c.name === name)?.count ?? 0)
      return { name, count, ...style }
    })
    .filter((c) => !hasRealData || c.count > 0) // hide empty real categories
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Explore</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Browse by Vibe</h2>
          <p className="text-gray-500 mt-3 max-w-md leading-relaxed">
            Find events that match your energy — from electric cultural nights to cutting-edge tech showcases.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link
                to={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="block p-6 rounded-3xl cursor-pointer transition-shadow hover:shadow-lg"
                style={{ background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)` }}
              >
                <span className="text-4xl block mb-4 select-none">{cat.emoji}</span>
                <h3 className="font-bold text-gray-900 text-lg tracking-tight">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cat.count} {hasRealData ? 'event' : 'fest'}{cat.count !== 1 ? 's' : ''}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
