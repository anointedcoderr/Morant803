// Demo auth for the play-money preview. Production swaps this module
// for server-side sessions; the call sites do not change.
//
// Hashing is async (WebCrypto), state writes are sync, so signup is split:
// prepareSignup() validates + hashes, createUser() mutates state.

import { hashPassword, uid } from './crypto.js'
import { post } from './ledger.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function prepareSignup({ name, email, password, ageConfirmed }) {
  const cleanName = (name || '').trim()
  const cleanEmail = (email || '').trim().toLowerCase()
  if (cleanName.length < 2) throw new Error('Enter your name')
  if (!EMAIL_RE.test(cleanEmail)) throw new Error('Enter a valid email')
  if ((password || '').length < 8) throw new Error('Password needs at least 8 characters')
  if (!ageConfirmed) throw new Error('You must confirm you are 18 or older')
  return { name: cleanName, email: cleanEmail, hash: await hashPassword(password) }
}

export function createUser(state, { name, email, hash }) {
  if (state.users.some((u) => u.email === email)) throw new Error('That email already has an account')
  const user = {
    id: uid(), name, email, hash,
    isAdmin: false, isBot: false, createdAt: Date.now(), selfExcludedUntil: null,
    depositedTodayCents: 0, lastDepositDay: '', dailyDepositCapCents: null,
  }
  state.users.push(user)
  post(state, {
    key: `grant:user:${user.id}:cash`, memo: 'Play-money starting balance',
    entries: [
      { account: 'house:treasury', delta: -state.settings.signupGrantCents },
      { account: `user:${user.id}:cash`, delta: state.settings.signupGrantCents },
    ],
  })
  return user
}

export async function verifyLogin(state, { email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const user = state.users.find((u) => u.email === cleanEmail && !u.isBot)
  if (!user) throw new Error('No account with that email')
  const hash = await hashPassword(password || '')
  if (hash !== user.hash) throw new Error('Wrong password')
  return { userId: user.id, token: uid(), ts: Date.now() }
}

export function setSelfExclusion(state, userId, ms) {
  const user = state.users.find((u) => u.id === userId)
  if (!user) throw new Error('Sign in first')
  user.selfExcludedUntil = ms ? Date.now() + ms : null
}

export function setDepositCap(state, userId, capCents) {
  const user = state.users.find((u) => u.id === userId)
  if (!user) throw new Error('Sign in first')
  if (capCents !== null && (!Number.isInteger(capCents) || capCents <= 0)) throw new Error('Enter a valid cap')
  user.dailyDepositCapCents = capCents
}
