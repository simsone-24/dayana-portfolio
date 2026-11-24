import { useEffect, useState } from 'react'
import { Settings, X, Trash2, Plus } from 'lucide-react'

const inputStyle = { borderColor: 'var(--blush)' }
const cardStyle = { background: '#fff', border: '1px solid var(--blush)' }
const dashedBtnStyle = { border: '1px dashed var(--maroon)', color: 'var(--maroon)' }

const TABS = [
  { key: 'services', label: 'Services' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'contact', label: 'Contact' },
]

export default function AdminPanel({
  open,
  onClose,
  services,
  gallery,
  contact,
  onSaveServices,
  onSaveGallery,
  onSaveContact,
}) {
  const [tab, setTab] = useState('services')
  const [draftServices, setDraftServices] = useState(services)
  const [draftGallery, setDraftGallery] = useState(gallery)
  const [draftContact, setDraftContact] = useState(contact)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (open) {
      setDraftServices(services)
      setDraftGallery(gallery)
      setDraftContact(contact)
      setStatus('')
    }
  }, [open, services, gallery, contact])

  const flash = (msg) => {
    setStatus(msg)
    setTimeout(() => setStatus(''), 1800)
  }

  // Services
  const updateService = (id, field, value) =>
    setDraftServices((list) => list.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  const addService = () =>
    setDraftServices((list) => [...list, { id: 's' + Date.now(), name: 'New service', price: '', desc: '' }])
  const removeService = (id) => setDraftServices((list) => list.filter((s) => s.id !== id))

  // Gallery
  const updatePhoto = (id, field, value) =>
    setDraftGallery((list) => list.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
  const addPhoto = () =>
    setDraftGallery((list) => [...list, { id: 'g' + Date.now(), caption: 'New photo', sub: '', imageUrl: '' }])
  const removePhoto = (id) => setDraftGallery((list) => list.filter((g) => g.id !== id))

  const handleSave = async () => {
    if (tab === 'services') await onSaveServices(draftServices)
    else if (tab === 'gallery') await onSaveGallery(draftGallery)
    else await onSaveContact(draftContact)
    flash('Saved ✓')
  }

  const contactField = (label, key, placeholder, type) => (
    <label className="block text-xs uppercase tracking-wide" style={{ color: 'var(--maroon)' }}>
      {label}
      <input
        value={draftContact[key]}
        onChange={(e) => setDraftContact({ ...draftContact, [key]: e.target.value })}
        placeholder={placeholder}
        type={type}
        className="mt-1 w-full text-sm px-2 py-1 rounded border outline-none normal-case"
        style={inputStyle}
      />
    </label>
  )

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(20,10,15,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        className="fixed top-0 right-0 h-full z-50 w-full sm:w-[440px] flex flex-col"
        style={{
          background: 'var(--cream)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s ease',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--blush)' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--maroon)' }}>
            <Settings className="w-4 h-4" />
            <span className="font-medium tracking-wide text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
              Manage site
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--maroon)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-5 pt-3 gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-3 py-1.5 text-sm rounded-full"
              style={{
                fontFamily: 'Jost, sans-serif',
                background: tab === t.key ? 'var(--maroon)' : 'transparent',
                color: tab === t.key ? 'var(--cream)' : 'var(--maroon)',
                border: '1px solid var(--maroon)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ fontFamily: 'Jost, sans-serif' }}>
          {tab === 'services' &&
            draftServices.map((s) => (
              <div key={s.id} className="p-3 rounded-lg space-y-2" style={cardStyle}>
                <div className="flex items-center gap-2">
                  <input
                    value={s.name}
                    onChange={(e) => updateService(s.id, 'name', e.target.value)}
                    placeholder="Service name"
                    className="flex-1 text-sm px-2 py-1 rounded border outline-none"
                    style={inputStyle}
                  />
                  <button onClick={() => removeService(s.id)} aria-label="Remove service" style={{ color: 'var(--maroon)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  value={s.price}
                  onChange={(e) => updateService(s.id, 'price', e.target.value)}
                  placeholder="Price, e.g. ₹5,000 onwards"
                  className="w-full text-sm px-2 py-1 rounded border outline-none"
                  style={inputStyle}
                />
                <textarea
                  value={s.desc}
                  onChange={(e) => updateService(s.id, 'desc', e.target.value)}
                  placeholder="Short description"
                  rows={2}
                  className="w-full text-sm px-2 py-1 rounded border outline-none resize-none"
                  style={inputStyle}
                />
              </div>
            ))}
          {tab === 'services' && (
            <button
              onClick={addService}
              className="w-full flex items-center justify-center gap-1 text-sm py-2 rounded-lg"
              style={dashedBtnStyle}
            >
              <Plus className="w-4 h-4" /> Add service
            </button>
          )}

          {tab === 'gallery' &&
            draftGallery.map((g) => (
              <div key={g.id} className="p-3 rounded-lg space-y-2" style={cardStyle}>
                <div className="flex items-center gap-2">
                  <input
                    value={g.caption}
                    onChange={(e) => updatePhoto(g.id, 'caption', e.target.value)}
                    placeholder="Caption"
                    className="flex-1 text-sm px-2 py-1 rounded border outline-none"
                    style={inputStyle}
                  />
                  <button onClick={() => removePhoto(g.id)} aria-label="Remove photo" style={{ color: 'var(--maroon)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  value={g.sub}
                  onChange={(e) => updatePhoto(g.id, 'sub', e.target.value)}
                  placeholder="Short subtitle"
                  className="w-full text-sm px-2 py-1 rounded border outline-none"
                  style={inputStyle}
                />
                <input
                  value={g.imageUrl}
                  onChange={(e) => updatePhoto(g.id, 'imageUrl', e.target.value)}
                  placeholder="Image URL (leave blank for placeholder)"
                  className="w-full text-sm px-2 py-1 rounded border outline-none"
                  style={inputStyle}
                />
              </div>
            ))}
          {tab === 'gallery' && (
            <button
              onClick={addPhoto}
              className="w-full flex items-center justify-center gap-1 text-sm py-2 rounded-lg"
              style={dashedBtnStyle}
            >
              <Plus className="w-4 h-4" /> Add photo
            </button>
          )}

          {tab === 'contact' && (
            <div className="p-3 rounded-lg space-y-3" style={cardStyle}>
              {contactField('WhatsApp number (with country code, digits only)', 'whatsapp', '919876543210')}
              {contactField('Phone number (as shown to visitors)', 'phone', '+91 98765 43210')}
              {contactField('Instagram handle (without @)', 'instagram', 'dayana_makeover')}
              {contactField('Email address (shown to visitors)', 'email', 'arockiyadayana2212@gmail.com', 'email')}
              {contactField('Service area', 'area', 'Available across your city & nearby areas')}
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--blush)' }}>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'var(--maroon)', color: 'var(--cream)', fontFamily: 'Jost, sans-serif' }}
          >
            Save changes
          </button>
          {status && (
            <span className="text-sm" style={{ color: 'var(--maroon)', fontFamily: 'Jost, sans-serif' }}>
              {status}
            </span>
          )}
        </div>
        <p
          className="px-5 pb-4 text-xs"
          style={{ color: 'var(--maroon)', opacity: 0.6, fontFamily: 'Jost, sans-serif' }}
        >
          Changes save in this browser. Once the site is live on a server, connect this panel to a real backend so
          edits show up for every visitor — see the README.
        </p>
      </div>
    </>
  )
}
