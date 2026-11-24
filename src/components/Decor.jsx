import { useEffect, useRef, useState } from 'react'

export const InstagramIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

// Decorative paisley / swirl motif
export const Paisley = ({ className = '', style = {} }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <path
      d="M100 18 C144 18 166 58 154 100 C143 140 100 162 68 140 C38 119 39 80 70 69 C92 61 108 74 102 95 C98 109 84 113 76 103"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="100" cy="18" r="4.5" fill="currentColor" />
  </svg>
)

function useInView() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let reduceMotion = false
    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      // ignore
    }
    if (reduceMotion) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" style={{ color: 'var(--gold)' }}>
      <span style={{ width: 40, height: 1, background: 'var(--gold)', opacity: 0.5 }} />
      <Paisley className="w-6 h-6" />
      <span style={{ width: 40, height: 1, background: 'var(--gold)', opacity: 0.5 }} />
    </div>
  )
}

export function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
