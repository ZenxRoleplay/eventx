import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import MagneticButton from './MagneticButton'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-screen bg-[#fafaf9] flex items-center overflow-hidden">
      {/* 3D canvas — desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>

      {/* Left gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf9] via-[#fafaf9]/90 via-50% to-[#fafaf9]/20 hidden md:block pointer-events-none" />

      {/* Mobile blobs */}
      <div className="absolute inset-0 md:hidden pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 -left-16 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-4 w-40 h-40 bg-sky-100 rounded-full blur-2xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 md:pt-36 md:pb-32 w-full">
        <motion.div className="max-w-[620px]" variants={stagger} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-[0.75rem] font-semibold px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Mumbai's #1 Fest Discovery Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[3.2rem] md:text-[4.5rem] lg:text-[5.2rem] font-bold text-gray-950 leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Find your
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-violet-600 bg-clip-text text-transparent">
              next big
            </span>
            <br />
            experience.
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
            From Mood Indigo to Techfest — discover, register, and experience Mumbai's most iconic college fests, all in one place.
          </motion.p>

          {/* Search */}
          <motion.div variants={fadeUp}>
            <SearchBar />
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="flex items-center gap-8 mt-10 flex-wrap">
            {[
              { value: '200+', label: 'College Fests' },
              { value: '50K+', label: 'Monthly Students' },
              { value: '40+',  label: 'Partner Colleges' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
