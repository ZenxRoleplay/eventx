import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllInterests, setInterests } from '../services/api'
import { useAuth } from '../context/AuthContext'

const EMOJI_MAP = {
  Music: '🎵', Technology: '⚡', Festival: '🎭', Art: '🎨',
  Business: '💼', Design: '✏️', Sports: '🏆', Food: '🍜',
  Comedy: '😂', Education: '📚',
}

export default function Interests() {
  const [interests, setAllInterests] = useState([])
  const [selected, setSelected]      = useState([])
  const [loading, setLoading]         = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const { setInterestsSet } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getAllInterests()
      .then((res) => setAllInterests(res.data))
      .catch(() => {})
      .finally(() => setFetchLoading(false))
  }, [])

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleSave = async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      await setInterests(selected)
      setInterestsSet(true)
      navigate('/discover')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg mx-auto mb-5">
            <span className="text-white font-bold text-lg">EX</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">What are you into?</h1>
          <p className="text-gray-500">Pick your interests so we can personalise your event feed.</p>
        </div>

        {fetchLoading ? (
          <div className="text-center text-gray-400">Loading…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-8">
            {interests.map((interest) => {
              const active = selected.includes(interest.id)
              return (
                <motion.button
                  key={interest.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(interest.id)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all font-medium text-sm ${
                    active
                      ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-sm'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{EMOJI_MAP[interest.name] ?? '✨'}</span>
                  <span>{interest.name}</span>
                  {active && <span className="ml-auto text-orange-500 text-base">✓</span>}
                </motion.button>
              )
            })}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={selected.length === 0 || loading}
          className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl hover:bg-gray-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving…' : `Continue with ${selected.length} interest${selected.length !== 1 ? 's' : ''}`}
        </button>

        <button
          onClick={() => navigate('/discover')}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-4"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  )
}
