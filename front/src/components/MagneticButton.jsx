import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function MagneticButton({ children, className = '', variant = 'dark', onClick }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 180, damping: 18 })
  const y = useSpring(0, { stiffness: 180, damping: 18 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.38)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.38)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    variant === 'dark'
      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200/60'
      : 'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-200/70'

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full transition-all active:scale-95 ${base} ${className}`}
    >
      {children}
    </motion.button>
  )
}
