// Double-entry ledger. All amounts are INTEGER CENTS.
// Balances are always derived from entries; there is no mutable balance column.
// Every money mutation posts one balanced transaction with an idempotency key.
//
// Account naming:
//   user:<id>:cash   spendable play-money balance
//   pool:<marketId>  stakes held inside a market pool
//   house:rake       platform rake collected at settlement
//   house:treasury   the play-money mint (allowed to run negative; it is the source)

const MINTS = new Set(['house:treasury'])

export function balanceOf(state, account) {
  let sum = 0
  for (const tx of state.ledger) {
    for (const e of tx.entries) if (e.account === account) sum += e.delta
  }
  return sum
}

export function entriesFor(state, account) {
  const rows = []
  for (const tx of state.ledger) {
    for (const e of tx.entries) {
      if (e.account === account) rows.push({ id: tx.id, ts: tx.ts, memo: tx.memo, delta: e.delta })
    }
  }
  return rows.sort((a, b) => b.ts - a.ts)
}

/** Post a balanced transaction. Idempotent on `key`. Throws on invariant violations. */
export function post(state, { key, memo, entries, ts }) {
  if (!key) throw new Error('ledger: missing idempotency key')
  if (state.ledger.some((t) => t.key === key)) return { duplicate: true }
  if (!entries?.length) throw new Error('ledger: no entries')
  for (const e of entries) {
    if (!Number.isInteger(e.delta)) throw new Error('ledger: non-integer amount')
  }
  const sum = entries.reduce((s, e) => s + e.delta, 0)
  if (sum !== 0) throw new Error('ledger: unbalanced transaction')

  // No user or pool account may go negative (aggregate per account, so a
  // transaction with several debits on one account cannot slip through).
  const perAccount = new Map()
  for (const e of entries) perAccount.set(e.account, (perAccount.get(e.account) || 0) + e.delta)
  for (const [account, delta] of perAccount) {
    if (delta < 0 && !MINTS.has(account)) {
      if (balanceOf(state, account) + delta < 0) {
        throw new Error('Insufficient balance')
      }
    }
  }
  state.ledger.push({ id: key, key, ts: ts ?? Date.now(), memo: memo || '', entries })
  return { duplicate: false }
}

export const fmtUSD = (cents, { sign = false } = {}) => {
  const v = Math.abs(cents) / 100
  // Always two decimals so tabular columns stay decimal-aligned.
  const s = v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (!sign) return cents < 0 ? `-${s}` : s
  return cents < 0 ? `-${s}` : `+${s}`
}
