import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'
import { getFest, getFestEvents, getFestMembers, getColleges } from '../../services/api'

/* ─── Inline EventCard ───────────────────────────────────────────────────── */
const CATEGORY_EMOJIS = {
  Cultural: '🎭', Technical: '⚡', Sports: '🏆', Music: '🎵',
  Business: '💼', Gaming: '🎮', Fashion: '👗', Literary: '📚',
  Technology: '🔧', Finance: '💰', Design: '✏️', Education: '📚',
}

function EventCard({ event, index = 0 }) {
  const navigate = useNavigate()
  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_1px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.11)] transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-44 bg-gradient-to-br from-stone-50 to-orange-50 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none opacity-60">
            {CATEGORY_EMOJIS[event.category] ?? '🎉'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-gray-700">
          {event.category ?? 'Event'}
        </span>
        {event.is_free && (
          <span className="absolute top-3 right-3 text-[11px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
            FREE
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-3 text-[12px] text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <span className="opacity-70">📍</span> {event.location ?? 'TBD'}
          </span>
          <span className="w-px h-3 bg-gray-200 flex-shrink-0" />
          <span className="flex items-center gap-1">
            <span className="opacity-70">🗓</span> {dateStr}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="font-semibold text-gray-800 text-sm">
            {event.is_free ? 'Free' : `₹ ${event.price}`}
          </span>
          <span className="text-[12px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
            View →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function EventSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
      </div>
    </div>
  )
}

/* ─── Role meta ──────────────────────────────────────────────────────────── */
const ROLE_META = {
  owner:     { label: 'Festival Director', color: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' },
  core:      { label: 'Core Team',         color: 'bg-sky-50 text-sky-700 border-sky-100',         dot: 'bg-sky-500' },
  volunteer: { label: 'Volunteer',         color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
}

/* ─── FestPage ───────────────────────────────────────────────────────────── */
export default function FestPage() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const { isLoggedIn } = useAuth?.() ?? {}

  const [fest,          setFest]          = useState(null)
  const [events,        setEvents]        = useState([])
  const [members,       setMembers]       = useState([])
  const [collegeName,   setCollegeName]   = useState('')
  const [festLoading,   setFestLoading]   = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [error,         setError]         = useState('')

  useEffect(() => {
    setFestLoading(true)
    setEventsLoading(true)
    setMembers([])
    setCollegeName('')

    // Parallel fetch: fest + events + colleges (members only if logged in)
    const festP    = getFest(slug)
    const eventsP  = getFestEvents(slug)
    const collegesP = getColleges()
    const membersP = isLoggedIn ? getFestMembers(slug).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })

    Promise.all([festP, eventsP, collegesP, membersP])
      .then(([fRes, eRes, cRes, mRes]) => {
        const f = fRes.data
        setFest(f)
        setEvents(eRes.data)
        setMembers(mRes.data)
        if (f.college_id && cRes.data) {
          const college = cRes.data.find((c) => c.id === f.college_id)
          if (college) setCollegeName(college.name)
        }
      })
      .catch(() => setError('Fest not found'))
      .finally(() => {
        setFestLoading(false)
        setEventsLoading(false)
      })
  }, [slug, isLoggedIn])

  /* Derived — group members by role */
  const ownerMembers     = members.filter((m) => m.role === 'owner')
  const coreMembers      = members.filter((m) => m.role === 'core')
  const volunteerMembers = members.filter((m) => m.role === 'volunteer')
  const hasCommittee     = members.length > 0

  /* ── Error ─────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 pt-44 text-center">
          <p className="text-5xl mb-5">🎪</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Fest not found</h1>
          <p className="text-gray-400 mb-8 text-sm">
            No fest with slug <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{slug}</code> exists.
          </p>
          <button
            onClick={() => navigate('/discover')}
            className="bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  /* ── Loading skeleton ────────────────────────────────────────────────── */
  if (festLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar />
        <div className="h-[520px] bg-gray-200 animate-pulse" />
        <div className="max-w-5xl mx-auto px-6 pt-14 space-y-4">
          <div className="h-3 bg-gray-100 rounded-full w-32 animate-pulse" />
          <div className="h-8 bg-gray-100 rounded-full w-64 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-full w-96 animate-pulse" />
        </div>
        <Footer />
      </div>
    )
  }

  /* ── Main page ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden">

        {/* Background */}
        {fest.banner_url ? (
          <img
            src={fest.banner_url}
            alt={fest.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-violet-950 to-indigo-900" />
        )}

        {/* Layered overlay — strong at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* Back button — top-left, outside navbar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[76px] left-6 md:left-10 z-20 flex items-center gap-1.5 text-white/70 hover:text-white text-[13px] font-medium transition-colors"
        >
          ← Back
        </button>

        {/* Hero content — bottom-anchored */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6 md:px-10 pb-12">

            {/* Logo */}
            {fest.logo_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden mb-5 shadow-2xl ring-1 ring-white/15"
              >
                <img src={fest.logo_url} alt={`${fest.name} logo`} className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Pill row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${
                fest.status === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/25'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/25'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${fest.status === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {fest.status === 'live' ? 'LIVE' : 'DRAFT'}
              </span>
              {collegeName && (
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/10 text-white/75 border border-white/15">
                  🏛️ {collegeName}
                </span>
              )}
            </div>

            {/* Fest name */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.6rem] md:text-[4rem] font-extrabold text-white leading-[1.08] tracking-tight mb-3"
            >
              {fest.name}
            </motion.h1>

            {/* Tagline */}
            {fest.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/65 text-[1.05rem] md:text-[1.2rem] max-w-xl font-light leading-relaxed"
              >
                {fest.tagline}
              </motion.p>
            )}

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE BODY
      ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* ────────────────────────────────────────────────────────────
            2. ABOUT
        ──────────────────────────────────────────────────────────── */}
        <section className="pt-16 pb-14 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">About</p>
          <div className="flex flex-col md:flex-row md:items-start md:gap-16">
            <div className="flex-1">
              <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight leading-snug mb-4">
                {fest.name}
              </h2>
              <p className="text-gray-500 text-[15px] leading-[1.75] max-w-xl">
                {fest.tagline
                  ? `${fest.name} is ${fest.tagline.toLowerCase()}. Experience world-class performances, workshops, competitions, and unforgettable moments—all under one roof.`
                  : `${fest.name} is one of the most anticipated college cultural festivals. Explore all the events, register for workshops, and be part of something extraordinary.`
                }
              </p>
            </div>
            {/* Meta pills */}
            <div className="mt-8 md:mt-0 flex flex-wrap md:flex-col gap-3 md:gap-2 flex-shrink-0">
              {collegeName && (
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">🏛️</span>
                  <span className="font-medium">{collegeName}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">🎉</span>
                <span className="font-medium">{events.length} Events</span>
              </div>
              {members.length > 0 && (
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">👥</span>
                  <span className="font-medium">{members.length} Team Members</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            3. EVENTS
        ──────────────────────────────────────────────────────────── */}
        <section className="pt-14 pb-14 border-b border-gray-100">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Programme</p>
              <h2 className="text-[1.5rem] font-bold text-gray-900 tracking-tight leading-tight">
                Events at {fest.name}
              </h2>
            </div>
            {!eventsLoading && events.length > 0 && (
              <Link to="/discover" className="text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                Browse All →
              </Link>
            )}
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <EventSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 rounded-2xl bg-white text-center border border-gray-100">
              <p className="text-4xl mb-3">🎪</p>
              <p className="text-gray-500 text-sm font-medium">No events published yet</p>
              <p className="text-gray-400 text-xs mt-1">Check back closer to the festival date</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ────────────────────────────────────────────────────────────
            4. COMMITTEE — shown when members exist
        ──────────────────────────────────────────────────────────── */}
        {hasCommittee && (
          <section className="pt-14 pb-14 border-b border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Organising Committee</p>
            <h2 className="text-[1.5rem] font-bold text-gray-900 tracking-tight mb-8">
              Meet the Core Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Owners */}
              {ownerMembers.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_1px_10px_rgba(0,0,0,0.06)] ring-1 ring-violet-100"
                >
                  <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[18px]">👑</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">Festival Director</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-violet-50 text-violet-700 border-violet-100">
                      Owner
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Core members */}
              {coreMembers.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_1px_10px_rgba(0,0,0,0.06)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[18px]">⭐</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">Core Member</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-100">
                      Core
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Volunteer count summary card (only if there are volunteers) */}
              {volunteerMembers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_1px_10px_rgba(0,0,0,0.06)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[18px]">🙌</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{volunteerMembers.length} Volunteers</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100">
                      Volunteer
                    </span>
                  </div>
                </motion.div>
              )}

            </div>
          </section>
        )}

        {/* ────────────────────────────────────────────────────────────
            5. REGISTER CTA
        ──────────────────────────────────────────────────────────── */}
        {events.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="py-14"
          >
            <div className="bg-gray-950 rounded-3xl px-8 md:px-14 py-12 md:py-14 text-center">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.14em] mb-4">
                {collegeName || 'College Fest'}
              </p>
              <h3 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-white leading-tight tracking-tight mb-3">
                Ready for {fest.name}?
              </h3>
              <p className="text-white/50 text-[15px] max-w-sm mx-auto leading-relaxed mb-10">
                Register for events, collect your passes, and be part of something unforgettable.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to={`/events/${events[0]?.id}`}
                  className="bg-white text-gray-900 font-bold text-sm px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors active:scale-[0.98]"
                >
                  Register Now
                </Link>
                <Link
                  to="/discover"
                  className="text-white/70 font-semibold text-sm px-8 py-3.5 rounded-full border border-white/15 hover:bg-white/8 hover:text-white transition-colors"
                >
                  Explore All Events
                </Link>
              </div>
            </div>
          </motion.section>
        )}

      </div>

      <Footer />
    </div>
  )
}

