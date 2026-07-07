// BET IT UP - single source of truth for all copy and data.
// Voice rules: no em/en dashes, plain human language, no filler.
// Built by Anointed Coder as a client visualization.

const img = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMAGES = {
  hero: img('1552072092-7f9b8d63efcb', 2000),
  step1: img('1607702713064-0143212236ae', 1200),
  step2: img('1570877920464-4c2d38501303', 1200),
  step3: img('1577998555981-6e798325914e', 1200),
  markets: img('1623694891075-a4cd0e3be35a', 1600),
}

export const SITE = {
  name: 'Bet It Up',
  kicker: "Don't Just Watch. Bet It Up.",
  taglineLine1: 'Back who you got.',
  taglineLine2: 'Ride the odds.', // rendered serif italic
  heroEyebrow: 'Live prediction market',
  heroSub:
    'Bet It Up turns the August 1 card into a live market. Pick your fighter, watch the odds move as the money comes in, and get paid the second the result is called.',
  event: {
    title: 'The Aug 1 Card',
    dateLabel: 'August 1, 2026',
    venue: 'Streaming on NowThatsTV',
    countdownISO: '2026-08-02T00:00:00Z', // Aug 1, 8:00 PM ET
  },
}

export const ANNOUNCE = {
  text: 'Concept preview built by Anointed Coder for the Bet It Up team. Explore the direction, then tell us what to change.',
  cta: 'Request changes',
}

export const NAV = [
  { label: 'Markets', href: '#markets' },
  { label: 'How it works', href: '#how' },
  { label: 'Why us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export const PAYMENTS = ['Apple Pay', 'Zelle', 'Cards']

// The real Aug 1 card. Personalities, so no pro records: names + live crowd odds only.
export const FIGHTS = [
  { tier: 'Main event', tag: "Men's bout", probA: 54, vol: '0.88M', a: { name: 'Cashy', initials: 'CA' }, b: { name: 'Dee', initials: 'DE' } },
  { tier: 'Co-main', tag: "Men's bout", probA: 61, vol: '0.57M', a: { name: 'Moses', initials: 'MO' }, b: { name: 'Tristate', initials: 'TR' } },
  { tier: 'Featured', tag: "Women's bout", probA: 47, vol: '0.44M', a: { name: 'Queen D', initials: 'QD' }, b: { name: 'Legacy', initials: 'LG' } },
  { tier: 'Featured', tag: "Men's bout", probA: 58, vol: '0.33M', a: { name: 'Ali', initials: 'AL' }, b: { name: 'Levi', initials: 'LV' } },
  { tier: 'Undercard', tag: "Women's bout", probA: 65, vol: '0.21M', a: { name: 'Judy', initials: 'JU' }, b: { name: 'Becca', initials: 'BE' } },
  { tier: 'Undercard', tag: "Women's bout", probA: 52, vol: '0.18M', a: { name: 'Day Day', initials: 'DD' }, b: { name: 'Fiji', initials: 'FJ' } },
]

export const FEATURES = [
  { eyebrow: 'Live odds', demo: 'shuffler', title: 'Prices that move with the money',
    body: 'Every market is priced by the crowd, not a house. When the money leans one way, you watch it happen in real time.',
    bullets: ['No house setting the line', 'Prices update as bets land'] },
  { eyebrow: 'Provably fair', demo: 'signature', title: 'Results you can check yourself',
    body: 'Each market settles against the official result on a record anyone can audit. No house edge, no quiet rule changes.',
    bullets: ['Verifiable settlement', 'Every payout on the record'] },
  { eyebrow: 'One tap', demo: 'cursor', title: 'Back your fighter in seconds',
    body: 'Pick who you got, set your stake, lock your price. The whole thing takes one tap from the couch.',
    bullets: ['Lock your price instantly', 'Track every position'] },
]

export const PILLARS = [
  { eyebrow: 'Predicted this card', prefix: '$', value: 2.4, decimals: 1, suffix: 'M',
    label: 'Staked across the full card as opening night nears.' },
  { eyebrow: 'Early access', prefix: '', value: 14600, decimals: 0, suffix: '+',
    label: 'Members already on the list for the August 1 card.' },
  { eyebrow: 'Payouts', prefix: '<', value: 30, decimals: 0, suffix: 's',
    label: 'Average time from the final bell to money in your wallet.' },
]

export const PROTOCOL = [
  { step: '01', eyebrow: 'Set up', title: 'Create your account and fund it',
    body: 'Sign up in under a minute and top up with Apple Pay, a card, or Zelle. Your balance is ready before the walkouts start.',
    bullets: ['One quick verification', 'Apple Pay, cards and Zelle', 'Balance ready instantly'], image: IMAGES.step1 },
  { step: '02', eyebrow: 'Take a side', title: 'Back your fighter at the price you like',
    body: 'Read the card, pick who you got, and lock your stake. Prices shift as the crowd moves, so an early call can pay more.',
    bullets: ['Six live markets on the card', 'Lock your price on the spot', 'Track every position'], image: IMAGES.step2 },
  { step: '03', eyebrow: 'Get paid', title: 'Win and withdraw the same night',
    body: 'Markets settle the moment the result is official. Winnings hit your wallet in seconds and you cash out whenever you want.',
    bullets: ['Instant, automatic settlement', 'Withdraw back to your method', 'Nothing to chase'], image: IMAGES.step3 },
]

export const WHY = [
  { icon: 'TrendingUp', title: 'Live crowd odds', body: 'Prices set by the market, not a bookie. Probabilities move as the money comes in.' },
  { icon: 'ShieldCheck', title: 'Verifiable results', body: 'Every market settles on a record you can check. No black box, no disputes.' },
  { icon: 'Zap', title: 'Instant settlement', body: 'Winnings land in seconds after the bell, not the next morning.' },
  { icon: 'Smartphone', title: 'Built for your phone', body: 'Designed thumb-first so you can back your fighter between rounds.' },
  { icon: 'Lock', title: 'Funds kept safe', body: 'Protected accounts, encrypted balances, and clear limits on every move.' },
  { icon: 'LifeBuoy', title: 'Play in control', body: 'Deposit caps, cool-downs and self-exclusion are always one tap away.' },
]

export const TRUST = [
  { icon: 'ShieldCheck', title: 'Provably fair', body: 'Verifiable settlement on every single market.' },
  { icon: 'Lock', title: 'Funds protected', body: 'Encrypted balances and segregated player wallets.' },
  { icon: 'LifeBuoy', title: 'Responsible by default', body: 'Limits, cool-downs and self-exclusion built in.' },
]

export const FAQ = [
  { q: 'What makes this different from a normal sportsbook?',
    a: 'There is no house setting the line and rooting against you. Prices come from the crowd, so when more people back a fighter that side gets more expensive and the other gets cheaper. You trade against other fans and the platform only takes a small fee.' },
  { q: 'How do I add money?',
    a: 'Fund your wallet with Apple Pay, a debit or credit card, or Zelle. Your balance is ready right away and you can withdraw your winnings the same way.' },
  { q: 'When do I get paid?',
    a: 'Markets settle as soon as a fight is officially called. Winnings land in your wallet within seconds and you can cash out whenever you like.' },
  { q: 'Is it only for this one event?',
    a: 'The August 1 card is the launch event. Once it goes well, Bet It Up grows into more events and more sports. This is the first step, not the whole plan.' },
  { q: 'Can I set limits for myself?',
    a: 'Yes. Deposit caps, cool-down periods and self-exclusion are built in from day one. Staying in control is part of the design, not an afterthought.' },
]

export const FOOTER_COLUMNS = [
  { title: 'Platform', links: [
    { label: 'Trade the card', route: '/app' },
    { label: 'How it works', href: '#how' },
    { label: 'Leaderboard', route: '/leaderboard' },
    { label: 'Wallet', route: '/wallet' },
  ] },
  { title: 'Account', links: [
    { label: 'Log in', route: '/login' },
    { label: 'Create account', route: '/signup' },
    { label: 'Responsible play', route: '/responsible' },
    { label: 'Help center', lock: 'Help center' },
  ] },
  { title: 'Company', links: [
    { label: 'About', href: '#why' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Terms', route: '/terms' },
    { label: 'Privacy', route: '/privacy' },
  ] },
]

export const CREDIT = {
  title: 'Designed and engineered by Anointed Coder',
  blurb: 'Built for the Bet It Up team as a visualization of the platform we will ship.',
  links: {
    website: 'https://anointedcoder.com',
    email: 'mailto:info@anointedcoder.com',
    whatsapp: 'https://wa.link/fi5z8a',
    telegram: 'https://t.me/AnointedCoder',
    call: 'https://calendar.app.google/P8nSAbsp9fDDFNRRA',
  },
  disclaimer:
    'This is a design concept by Anointed Coder for the Bet It Up team. Fighters, odds and figures are illustrative placeholders. Nothing here accepts real money.',
}

export const LOCK_MESSAGE =
  'This screen is part of the complete Bet It Up platform. Once we agree on scope and the first milestone is funded, our team builds it out in full.'
