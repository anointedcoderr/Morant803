// MORANT803 — single source of truth for all copy and data.
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
  name: 'MORANT803',
  wordmarkA: 'MORANT',
  wordmarkB: '803',
  taglineLine1: 'Back a fighter.',
  taglineLine2: 'Ride the odds.', // rendered serif italic
  heroEyebrow: 'Live boxing prediction market',
  heroSub:
    'MORANT803 turns fight night into a live market. Pick a corner, watch the price move as the money lands, and get paid the second the result is called.',
  event: {
    title: 'Fight Night 01',
    dateLabel: 'Friday, July 31, 2026',
    timeLabel: '9:00 PM ET',
    countdownISO: '2026-08-01T01:00:00Z', // 9:00 PM EDT
  },
}

export const ANNOUNCE = {
  text: 'Concept preview built by Anointed Coder for Morant803. Explore the direction, then tell us what to change.',
  cta: 'Request changes',
}

export const NAV = [
  { label: 'Markets', href: '#markets' },
  { label: 'How it works', href: '#how' },
  { label: 'Why us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export const PAYMENTS = ['Apple Pay', 'Zelle', 'Cards']

export const FIGHTS = [
  { tier: 'Main event', weight: 'Super Lightweight Title', probA: 57, vol: '0.94M',
    a: { first: 'Diego', last: 'Marquez', nick: 'El Rayo', record: '24-1', ko: '18 KO', initials: 'DM' },
    b: { first: 'Kwame', last: 'Osei', nick: 'The Hammer', record: '21-2', ko: '15 KO', initials: 'KO' } },
  { tier: 'Co-main', weight: 'Welterweight', probA: 63, vol: '0.61M',
    a: { first: 'Andre', last: 'Bishop', nick: 'Nightmare', record: '17-0', ko: '12 KO', initials: 'AB' },
    b: { first: 'Yuto', last: 'Tanaka', nick: 'Iron', record: '19-3', ko: '9 KO', initials: 'YT' } },
  { tier: 'Bout 3', weight: 'Middleweight', probA: 48, vol: '0.42M',
    a: { first: 'Malik', last: 'Johnson', nick: 'Cold Steel', record: '15-1', ko: '10 KO', initials: 'MJ' },
    b: { first: 'Rafael', last: 'Duarte', nick: 'Toro', record: '16-2', ko: '11 KO', initials: 'RD' } },
  { tier: 'Bout 4', weight: 'Featherweight', probA: 71, vol: '0.28M',
    a: { first: 'Sean', last: 'Kelly', nick: 'Shadow', record: '12-0', ko: '7 KO', initials: 'SK' },
    b: { first: 'Bantu', last: 'Nkosi', nick: 'Blitz', record: '13-4', ko: '8 KO', initials: 'BN' } },
  { tier: 'Bout 5', weight: 'Heavyweight', probA: 66, vol: '0.37M',
    a: { first: 'Viktor', last: 'Petrov', nick: 'Avalanche', record: '11-0', ko: '11 KO', initials: 'VP' },
    b: { first: 'Tunde', last: 'Bello', nick: 'The Wall', record: '14-3', ko: '10 KO', initials: 'TB' } },
  { tier: 'Bout 6', weight: 'Super Bantamweight', probA: 54, vol: '0.19M',
    a: { first: 'Emilio', last: 'Reyes', nick: 'Chispa', record: '18-2', ko: '9 KO', initials: 'ER' },
    b: { first: 'Jae-won', last: 'Park', nick: 'Ghost', record: '17-1', ko: '6 KO', initials: 'JP' } },
  { tier: 'Bout 7', weight: 'Lightweight', probA: 59, vol: '0.16M',
    a: { first: 'Deshawn', last: 'Carter', nick: 'Flash', record: '9-0', ko: '5 KO', initials: 'DC' },
    b: { first: 'Ollie', last: 'Grant', nick: 'Bulldog', record: '11-2', ko: '7 KO', initials: 'OG' } },
  { tier: 'Bout 8', weight: "Women's Flyweight", probA: 68, vol: '0.13M',
    a: { first: 'Ana', last: 'Solis', nick: 'La Reina', record: '10-0', ko: '4 KO', initials: 'AS' },
    b: { first: 'Mei', last: 'Chen', nick: 'Storm', record: '12-3', ko: '5 KO', initials: 'MC' } },
]

export const FEATURES = [
  { eyebrow: 'Live odds', demo: 'shuffler', title: 'Prices that move with the money',
    body: 'Every market is priced by the crowd, not a house. When the money leans one way, you watch it happen in real time.',
    bullets: ['No house setting the line', 'Prices update as bets land'] },
  { eyebrow: 'Provably fair', demo: 'signature', title: 'Results you can check yourself',
    body: 'Each market settles against the official result on a record anyone can audit. No house edge, no quiet rule changes.',
    bullets: ['Verifiable settlement', 'Every payout on the record'] },
  { eyebrow: 'One tap', demo: 'cursor', title: 'Back a fighter in seconds',
    body: 'Pick a corner, set your stake, lock your price. The whole thing takes one tap from the couch.',
    bullets: ['Lock your price instantly', 'Track every position'] },
]

export const PILLARS = [
  { eyebrow: 'Predicted this card', prefix: '$', value: 2.4, decimals: 1, suffix: 'M',
    label: 'Staked across the full card as opening night nears.' },
  { eyebrow: 'Early access', prefix: '', value: 14600, decimals: 0, suffix: '+',
    label: 'Members already on the list for Fight Night 01.' },
  { eyebrow: 'Payouts', prefix: '<', value: 30, decimals: 0, suffix: 's',
    label: 'Average time from the final bell to money in your wallet.' },
]

export const PROTOCOL = [
  { step: '01', eyebrow: 'Set up', title: 'Create your account and fund it',
    body: 'Sign up in under a minute and top up with Apple Pay, a card, or Zelle. Your balance is ready before the walkouts start.',
    bullets: ['One quick verification', 'Apple Pay, cards and Zelle', 'Balance ready instantly'], image: IMAGES.step1 },
  { step: '02', eyebrow: 'Take a side', title: 'Back a fighter at the price you like',
    body: 'Read the card, pick a corner, and lock your stake. Prices shift as the crowd moves, so an early call can pay more.',
    bullets: ['Eight to ten live markets', 'Lock your price on the spot', 'Track every position'], image: IMAGES.step2 },
  { step: '03', eyebrow: 'Get paid', title: 'Win and withdraw the same night',
    body: 'Markets settle the moment the result is official. Winnings hit your wallet in seconds and you cash out whenever you want.',
    bullets: ['Instant, automatic settlement', 'Withdraw back to your method', 'Nothing to chase'], image: IMAGES.step3 },
]

export const WHY = [
  { icon: 'TrendingUp', title: 'Live crowd odds', body: 'Prices set by the market, not a bookie. Probabilities move as the money flows in.' },
  { icon: 'ShieldCheck', title: 'Verifiable results', body: 'Every market settles on a record you can check. No black box, no disputes.' },
  { icon: 'Zap', title: 'Instant settlement', body: 'Winnings land in seconds after the bell, not the next morning.' },
  { icon: 'Smartphone', title: 'Built for your phone', body: 'Designed thumb-first so you can back a fighter between rounds.' },
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
    a: 'Fight Night 01 is the launch card. Once it goes well, MORANT803 grows into more events and more sports. This is the first step, not the whole plan.' },
  { q: 'Can I set limits for myself?',
    a: 'Yes. Deposit caps, cool-down periods and self-exclusion are built in from day one. Staying in control is part of the design, not an afterthought.' },
]

export const FOOTER_COLUMNS = [
  { title: 'Platform', links: [
    { label: 'Markets', href: '#markets' },
    { label: 'How it works', href: '#how' },
    { label: 'Leaderboard', lock: 'Leaderboard' },
    { label: 'Wallet', lock: 'Wallet' },
  ] },
  { title: 'Account', links: [
    { label: 'Log in', lock: 'Log in' },
    { label: 'Get early access', lock: 'Early access' },
    { label: 'Responsible play', lock: 'Responsible play' },
    { label: 'Help center', lock: 'Help center' },
  ] },
  { title: 'Company', links: [
    { label: 'About', href: '#why' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Terms', lock: 'Terms' },
    { label: 'Privacy', lock: 'Privacy' },
  ] },
]

export const CREDIT = {
  title: 'Designed and engineered by Anointed Coder',
  blurb: 'Built for Morant803 as a visualization of the platform we will ship.',
  links: {
    website: 'https://anointedcoder.com',
    email: 'mailto:info@anointedcoder.com',
    whatsapp: 'https://wa.link/fi5z8a',
    telegram: 'https://t.me/AnointedCoder',
    call: 'https://calendar.app.google/P8nSAbsp9fDDFNRRA',
  },
  disclaimer:
    'This is a design concept by Anointed Coder for Morant803. Fights, fighters, odds and figures are illustrative placeholders. Nothing here accepts real money.',
}

export const LOCK_MESSAGE =
  'This screen is part of the complete MORANT803 platform. Once we agree on scope and the first milestone is funded, our team builds it out in full.'
