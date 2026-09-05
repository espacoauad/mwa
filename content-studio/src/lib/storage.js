export const NAMESPACE = 'mwa-content-studio'

function fullKey(name) {
  return `${NAMESPACE}:${name}`
}

export function readCollection(name, fallback = []) {
  return readItem(name, fallback)
}

export function writeCollection(name, value) {
  writeItem(name, value)
}

export function readItem(name, fallback = null) {
  try {
    const raw = localStorage.getItem(fullKey(name))
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeItem(name, value) {
  localStorage.setItem(fullKey(name), JSON.stringify(value))
}

export function allKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith(`${NAMESPACE}:`))
}
