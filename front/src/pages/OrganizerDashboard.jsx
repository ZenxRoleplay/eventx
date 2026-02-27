import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getMyEvents } from '../services/api'

const STATUS_COLORS = {
  approved: 'bg-green-50 text-green-600 border-green-100',
  pending:  'bg-yellow-50 text-yellow-600 border-yellow-100',
  rejected: 'bg-red-50 text-red-600 border-red-100',
}

/** Group events by fest. Standalone events collected under a sentinel key. */
function groupByFest(events) {
  const map = new Map()
  for (const event of events) {
    const key  = event.fest_slug ?? '__standalone__'
    const name = event.fest_name ?? 'Standalone Events'
    if (!map.has(key)) map.set(key, { festSlug: key, festName: name, events: [] })
    map.get(key).events.push(event)
  }
  const groups = [...map.values()]
  return [
    ...groups.filter((g) => g.festSlug !== '__standalone__'),
    ...groups.filter((g) => g.festSlug === '__standalone__'),
  ]
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyEvents()
      .then((r) => setEvents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const byStatus = (s) => events.filter((e) => e.status === s).length
  const groups   = useMemo(() => groupByFest(events), [events])

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Organiser</span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">My Events</h1>
            <p className="text-gray-500 mt-2">Manage all your submitted events</p>
          </div>
          <Link
            to="/events/create"
            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>+</span> New Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total',    value: events.length,       color: 'bg-gray-50 text-gray-700' },
            { label: 'Live',     value: byStatus('approved'), color: 'bg-green-50 text-green-600' },
            { label: 'Pending',  value: byStatus('pending'),  color: 'bg-yellow-50 text-yellow-600' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
              <div className="text-3xl font-bold mb-1">{s.value}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🎪</span>
            <p className="text-gray-500 mb-6">No events yet. Create your first one!</p>
            <Link to="/events/create" className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors">
              Create Event →
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group.festSlug}>
                {/* Fest group header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{group.festSlug === '__standalone__' ? '🗂' : '🎪'}</span>
                    <h2 className="font-bold text-gray-800 text-base">{group.festName}</h2>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {group.events.length} event{group.events.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {group.festSlug !== '__standalone__' && (
                    <Link
                      to={`/fest/${group.festSlug}`}
                      className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      View Fest →
                    </Link>
                  )}
                </div>

                {/* Event rows */}
                <div className="space-y-3">
                  {group.events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Image or emoji */}
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {event.image_url
                          ? <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                          : <span className="text-2xl">🎉</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full ${STATUS_COLORS[event.status] ?? STATUS_COLORS.pending}`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          {event.category && <span>🏷 {event.category}</span>}
                          {event.location && <span>📍 {event.location}</span>}
                          {event.date && <span>🗓 {new Date(event.date).toLocaleDateString('en-IN')}</span>}
                          <span>💳 {event.is_free ? 'Free' : `₹${event.price}`}</span>
                        </div>
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
                      >
                        View →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
