import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getColleges } from '../services/api'
import { COLLEGES } from '../lib/data'

export default function CollegeSection() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getColleges()
      .then((r) => setColleges(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Fall back to static data if API returns nothing
  const items = colleges.length > 0 ? colleges : COLLEGES.map((c, i) => ({ id: i, ...c, event_count: c.fests }))
  const isReal = colleges.length > 0

  return (
    <section className="bg-[#fafaf9] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">Colleges</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Top Colleges</h2>
            <p className="text-gray-500 mt-2">Mumbai's finest institutions and their fests</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {items.map((college, i) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <Link
                  to={isReal ? `/fests?college=${college.id}` : `/fests?q=${encodeURIComponent(college.name)}`}
                  className="block bg-white hover:bg-gray-50 rounded-2xl p-4 text-center transition-all shadow-sm hover:shadow-md"
                >
                  <span className="text-3xl block mb-2 select-none">{college.emoji ?? '🏛️'}</span>
                  <h3 className="font-semibold text-gray-900 text-xs leading-tight mb-1">{college.name}</h3>
                  <p className="text-[10px] text-gray-400">{college.event_count ?? 0} event{college.event_count !== 1 ? 's' : ''}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">{isReal ? college.area : college.area}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
