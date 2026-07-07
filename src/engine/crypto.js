// Demo-grade hashing for the play-money preview (WebCrypto SHA-256).
// The production build swaps this for server-side argon2/bcrypt.
const SALT = 'betitup.demo.v1'

export async function hashPassword(password) {
  const data = new TextEncoder().encode(`${SALT}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`)
