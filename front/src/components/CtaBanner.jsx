import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MagneticButton from './MagneticButton'

export default function CtaBanner() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gray-950 px-10 py-16 md:px-20 md:py-20 text-center"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              🎓 For College Students
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-tight mb-6 max-w-3xl mx-auto">
              Never miss a{' '}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                Mumbai fest
              </span>{' '}
              again.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get personalised alerts, one-tap registrations, and your digital pass — all from one app.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/signup">
                <MagneticButton variant="orange" className="text-[0.95rem] px-8 py-4">
                  <span>Create Free Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </MagneticButton>
              </Link>
              <Link to="/discover" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                Browse events first →
              </Link>
            </div>
            <p className="text-gray-600 text-xs mt-10">
              Trusted by students from IIT Bombay, VJTI, NMIMS, Xavier's and 35+ more colleges
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
