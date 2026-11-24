import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, Mail, MapPin, MessageCircle, Phone, Send, Settings, Sparkles, X } from 'lucide-react'
import { getItem, setItem } from './storage'
import { DEFAULT_SERVICES, DEFAULT_GALLERY, DEFAULT_CONTACT, FONTS_IMPORT } from './data'
import { InstagramIcon, Paisley, Divider, Reveal } from './components/Decor'
import AdminPanel from './components/AdminPanel'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'booking', label: 'Book Now' },
]

const THEME_CSS = `
        ${FONTS_IMPORT}
        :root {
          --cream: #FBF6EE;
          --cream-deep: #F1E4D3;
          --maroon: #6E1E38;
          --maroon-deep: #43142A;
          --gold: #C9A24B;
          --gold-soft: #E3C888;
          --ink: #3A2532;
          --blush: #F1DCC9;
        }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .placeholder-card {
          background: linear-gradient(135deg, var(--blush), var(--cream-deep));
        }
      `

const contactCardStyle = { background: '#fff', border: '1px solid var(--blush)' }
const fieldStyle = { border: '1px solid var(--blush)' }

export default function App() {
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [gallery, setGallery] = useState(DEFAULT_GALLERY)
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [loading, setLoading] = useState(true)
  const [adminOpen, setAdminOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', date: '', service: '', message: '' })
  const [honeypot, setHoneypot] = useState('')

  // Load saved edits from storage
  useEffect(() => {
    ;(async () => {
      try {
        const [savedServices, savedGallery, savedContact] = await Promise.all([
          getItem('services'),
          getItem('gallery'),
          getItem('contact'),
        ])
        if (savedServices) setServices(savedServices)
        if (savedGallery?.some((g) => g.imageUrl)) setGallery(savedGallery)
        if (savedContact) setContact({ ...DEFAULT_CONTACT, ...savedContact })
      } catch (err) {
        console.error('Storage load error:', err)
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const saveServices = useCallback(async (data) => {
    setServices(data)
    await setItem('services', data)
  }, [])
  const saveGallery = useCallback(async (data) => {
    setGallery(data)
    await setItem('gallery', data)
  }, [])
  const saveContact = useCallback(async (data) => {
    setContact(data)
    await setItem('contact', data)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const whatsappLink = (text) =>
    `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

  const instaHandle = contact.instagram
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
  const instaUrl = `https://instagram.com/${instaHandle}`

  const sendEnquiry = () => {
    const text = `Hi Dayana! I'd like to book an appointment.\n\nName: ${form.name || '-'}\nPhone: ${form.phone || '-'}\nEvent date: ${form.date || '-'}\nService: ${form.service || '-'}\nMessage: ${form.message || '-'}`
    window.open(whatsappLink(text), '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream, #FBF6EE)', fontFamily: 'Jost, sans-serif' }}
      >
        <style>{FONTS_IMPORT}</style>
        <div className="flex flex-col items-center gap-3" style={{ color: '#6E1E38' }}>
          <Paisley className="w-10 h-10 animate-pulse" />
          <span className="text-base tracking-wide">Loading Dayana Makeovers…</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Jost, sans-serif', color: 'var(--ink)', background: 'var(--cream)' }} className="min-h-screen">
      <style>{THEME_CSS}</style>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 transition-all"
        style={{
          background: scrolled ? 'var(--cream)' : 'transparent',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <Paisley className="w-6 h-6" style={{ color: scrolled ? 'var(--maroon)' : 'var(--gold-soft)' }} />
            <span
              className="font-display text-2xl"
              style={{ color: scrolled ? 'var(--maroon)' : '#fff', letterSpacing: '0.02em' }}
            >
              Dayana <span style={{ color: 'var(--gold)' }}>Makeovers</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-base tracking-wide"
                style={{ color: scrolled ? 'var(--maroon)' : '#fff' }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ color: scrolled ? 'var(--maroon)' : '#fff' }}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-1 px-5 pb-4" style={{ background: 'var(--cream)' }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-2.5 text-base"
                style={{ color: 'var(--maroon)' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-5"
        style={{ background: 'linear-gradient(160deg, var(--maroon) 0%, var(--maroon-deep) 70%)' }}
      >
        <Paisley
          className="absolute w-[520px] h-[520px] opacity-10"
          style={{ color: 'var(--gold-soft)', top: '-8%', right: '-10%' }}
        />
        <Paisley
          className="absolute w-[360px] h-[360px] opacity-10"
          style={{ color: 'var(--gold-soft)', bottom: '-6%', left: '-8%', transform: 'rotate(180deg)' }}
        />
        <div className="relative z-10 text-center max-w-2xl">
          <p className="text-sm tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold-soft)' }}>
            Bridal Makeup &amp; Mehndi Artist
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-tight mb-4" style={{ color: '#fff' }}>
            Dayana <span style={{ color: 'var(--gold)' }}>Makeovers</span>
          </h1>
          <p className="text-base sm:text-lg mb-2" style={{ color: 'var(--blush)' }}>
            {contact.area}
          </p>
          <p className="italic text-lg sm:text-xl mb-8 font-display" style={{ color: 'var(--gold-soft)' }}>
            Where every bride finds her radiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappLink("Hi Dayana! I'd like to enquire about booking.")}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full text-base font-medium flex items-center gap-2"
              style={{ background: 'var(--gold)', color: 'var(--maroon-deep)' }}
            >
              <MessageCircle className="w-4 h-4" /> Book on WhatsApp
            </a>
            <a
              href={instaUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full text-base font-medium flex items-center gap-2"
              style={{ border: '1px solid var(--gold-soft)', color: '#fff' }}
            >
              <InstagramIcon className="w-4 h-4" /> Instagram
            </a>
            <button
              onClick={() => scrollTo('gallery')}
              className="px-7 py-3.5 rounded-full text-base font-medium"
              style={{ border: '1px solid var(--gold-soft)', color: '#fff' }}
            >
              View Gallery
            </button>
          </div>
        </div>
        <button
          onClick={() => scrollTo('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ color: 'var(--gold-soft)' }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-5 py-24 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div
            className="aspect-[4/5] rounded-2xl placeholder-card flex items-center justify-center relative overflow-hidden"
            style={{ border: '1px solid var(--blush)' }}
          >
            <Paisley className="w-28 h-28" style={{ color: 'var(--gold)', opacity: 0.4 }} />
            <span
              className="absolute bottom-4 text-sm tracking-wide"
              style={{ color: 'var(--maroon)', opacity: 0.6 }}
            >
              Photo of Dayana coming soon
            </span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            Meet the artist
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-5" style={{ color: 'var(--maroon)' }}>
            Hi, I'm Dayana
          </h2>
          <p className="mb-4 text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            I help brides and clients feel like the best version of themselves — for weddings, receptions,
            engagements and every celebration in between. Every look is built around your face, your outfit and your
            comfort, with clean application and long-lasting finish.
          </p>
          <p className="mb-6 text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            Alongside makeup, I create bridal and party mehndi designs, from intricate traditional patterns to quick
            modern styles — so you can have one artist for the whole look.
          </p>
          <div className="flex items-center gap-2 text-base" style={{ color: 'var(--maroon)' }}>
            <MapPin className="w-4 h-4" />
            <span>{contact.area}</span>
          </div>
        </Reveal>
      </section>

      <Divider />

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-5 py-20">
        <Reveal className="text-center mb-14">
          <p className="text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            What I offer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--maroon)' }}>
            Services
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <div className="p-6 rounded-2xl h-full flex flex-col" style={contactCardStyle}>
                <Sparkles className="w-5 h-5 mb-3" style={{ color: 'var(--gold)' }} />
                <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--maroon)' }}>
                  {s.name}
                </h3>
                <p className="text-base mb-4 flex-1 leading-relaxed" style={{ opacity: 0.75 }}>
                  {s.desc}
                </p>
                <p className="text-base font-medium" style={{ color: 'var(--gold)' }}>
                  {s.price}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-5 py-20">
        <Reveal className="text-center mb-14">
          <p className="text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            Recent work
          </p>
          <h2 className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--maroon)' }}>
            Gallery
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={i * 50}>
              <div
                className="aspect-square rounded-xl overflow-hidden relative group"
                style={{ border: '1px solid var(--blush)' }}
              >
                {g.imageUrl ? (
                  <img
                    src={g.imageUrl}
                    alt={g.sub ? `${g.caption} — ${g.sub}` : g.caption}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 30%' }}
                  />
                ) : (
                  <div className="w-full h-full placeholder-card flex items-center justify-center">
                    <Paisley className="w-10 h-10" style={{ color: 'var(--gold)', opacity: 0.4 }} />
                  </div>
                )}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(67,20,42,0.75)' }}
                >
                  <span className="font-display text-xl" style={{ color: '#fff' }}>
                    {g.caption}
                  </span>
                  {g.sub && (
                    <span className="text-sm mt-1" style={{ color: 'var(--gold-soft)' }}>
                      {g.sub}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* Booking */}
      <section id="booking" className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12">
        <Reveal>
          <p className="text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
            Get in touch
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-6" style={{ color: 'var(--maroon)' }}>
            Book Your Date
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ opacity: 0.8 }}>
            Reach out however's easiest — WhatsApp, a call, Instagram, or the form here. I'll get back to you with
            availability and pricing for your date.
          </p>
          <div className="space-y-3">
            <a
              href={whatsappLink("Hi Dayana! I'd like to enquire about booking.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl"
              style={contactCardStyle}
            >
              <MessageCircle className="w-5 h-5" style={{ color: 'var(--maroon)' }} />
              <span className="text-base">Chat on WhatsApp</span>
            </a>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 p-3 rounded-xl" style={contactCardStyle}>
              <Phone className="w-5 h-5" style={{ color: 'var(--maroon)' }} />
              <span className="text-base">{contact.phone}</span>
            </a>
            <a href={instaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl" style={contactCardStyle}>
              <InstagramIcon className="w-5 h-5" style={{ color: 'var(--maroon)' }} />
              <span className="text-base">@{instaHandle}</span>
            </a>
            <a
              href={`mailto:${contact.email}?subject=Booking%20enquiry`}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={contactCardStyle}
            >
              <Mail className="w-5 h-5" style={{ color: 'var(--maroon)' }} />
              <span className="text-base break-all">{contact.email}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="p-6 rounded-2xl space-y-4" style={contactCardStyle}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-3 py-3 rounded-lg text-base outline-none"
              style={fieldStyle}
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Your phone number"
              className="w-full px-3 py-3 rounded-lg text-base outline-none"
              style={fieldStyle}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-3 rounded-lg text-base outline-none"
                style={fieldStyle}
              />
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full px-3 py-3 rounded-lg text-base outline-none"
                style={fieldStyle}
              >
                <option value="">Select service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me a bit about your event..."
              rows={3}
              className="w-full px-3 py-3 rounded-lg text-base outline-none resize-none"
              style={fieldStyle}
            />
            {/* Honeypot field for spam bots */}
            <input
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />
            <button
              onClick={sendEnquiry}
              className="w-full py-3.5 rounded-lg text-base font-medium flex items-center justify-center gap-2"
              style={{ background: 'var(--maroon)', color: 'var(--cream)' }}
            >
              <Send className="w-4 h-4" /> Send Enquiry
            </button>
            <p className="text-xs text-center" style={{ opacity: 0.65 }}>
              Opens WhatsApp with your details.
            </p>
            {sent && (
              <p className="text-sm text-center" style={{ color: 'var(--maroon)' }}>
                Opening WhatsApp with your details…
              </p>
            )}
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="mt-12 px-5 py-10" style={{ background: 'var(--maroon-deep)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Paisley className="w-5 h-5" style={{ color: 'var(--gold-soft)' }} />
            <span className="font-display text-xl" style={{ color: '#fff' }}>
              Dayana Makeovers
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <a
              href={instaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--gold-soft)' }}
              aria-label={`Dayana Makeovers on Instagram, @${instaHandle}`}
            >
              <InstagramIcon className="w-4 h-4" /> @{instaHandle}
            </a>
            <p className="text-sm" style={{ color: 'var(--blush)', opacity: 0.7 }}>
              © 2026 Dayana Makeovers. Made with love for brides everywhere.
            </p>
          </div>
          <button
            onClick={() => setAdminOpen(true)}
            className="flex items-center gap-1 text-sm"
            style={{ color: 'var(--gold-soft)', opacity: 0.7 }}
          >
            <Settings className="w-3.5 h-3.5" /> Manage site
          </button>
        </div>
      </footer>

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        services={services}
        gallery={gallery}
        contact={contact}
        onSaveServices={saveServices}
        onSaveGallery={saveGallery}
        onSaveContact={saveContact}
      />
    </div>
  )
}
