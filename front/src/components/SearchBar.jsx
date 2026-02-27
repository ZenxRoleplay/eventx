import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK = ['Mood Indigo', 'Techfest', 'Malhar', 'Umang', 'Gaming Fests', 'IIT Bombay']

export default function SearchBar() {
  const [query, setQuery]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const suggestions = QUICK.filter(
    (s) => query.length > 0 && s.toLowerCase().includes(query.toLowerCase())
  )

  const handleSearch = (q = query) => {
    if (q.trim()) navigate(`/discover?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="relative max-w-xl">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 20px 60px rgba(0,0,0,0.12), 0 0 0 2px rgba(249,115,22,0.2)'
            : '0 4px 24px rgba(0,0,0,0.07)',
        }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5"
      >
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search events, categories…"
          className="flex-1 text-gray-900 placeholder-gray-400 text-[0.95rem] outline-none bg-transparent"
        />
        <button
          onClick={() => handleSearch()}
          className="flex-shrink-0 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-700 transition-colors active:scale-95"
        >
          Search
        </button>
      </motion.div>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={() => { setQuery(s); handleSearch(s) }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
              >
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!focused && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-gray-400">Popular:</span>
          {['Mood Indigo', 'Techfest', 'Cultural', 'Gaming'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); handleSearch(tag) }}
              className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-1 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
