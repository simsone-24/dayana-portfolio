// Simple localStorage wrapper. Async so it can later be swapped for a real backend.
const PREFIX = 'dayana:'

export async function getItem(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('storage.getItem error:', err)
    return null
  }
}

export async function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error('storage.setItem error:', err)
    return false
  }
}
