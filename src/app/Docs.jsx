import AppShell from './AppShell.jsx'

function Doc({ title, updated, children }) {
  return (
    <AppShell title={title}>
      <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Draft for review · updated {updated}</p>
      <div className="max-w-3xl space-y-6 text-[15px] leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-default [&_h2]:mt-8">
        {children}
      </div>
    </AppShell>
  )
}

export function Terms() {
  return (
    <Doc title="Terms of Service" updated="July 2026">
      <p>These draft terms cover the Bet It Up play-money preview. They are a working template for the operator's counsel to review and finalize before any real-money launch.</p>
      <h2>1. The service</h2>
      <p>Bet It Up is a prediction platform for live fight cards. In this preview all balances are play-money with no cash value, no purchases, and no payouts of any kind.</p>
      <h2>2. Eligibility</h2>
      <p>You must be 18 or older to create an account. The operator may restrict access by location once real-money features launch, and identity verification will be required at that point.</p>
      <h2>3. Markets and settlement</h2>
      <p>Markets are pari-mutuel pools. Stakes join a pool, the platform takes a stated rake at settlement, and winners split the remainder in proportion to their stakes. Results settle against the official outcome of each bout. Settled markets are final except for manifest error.</p>
      <h2>4. Fair play</h2>
      <p>One account per person. Automation, collusion, and exploiting defects are prohibited and void positions. The operator may suspend markets to protect the pool.</p>
      <h2>5. Responsible play</h2>
      <p>Deposit caps, cool-downs, and self-exclusion are available to every member from day one. See the Play in Control page.</p>
      <h2>6. Liability</h2>
      <p>The preview is provided as-is for evaluation. To the fullest extent permitted by law, the operator and its developers are not liable for losses arising from use of the preview.</p>
    </Doc>
  )
}

export function Privacy() {
  return (
    <Doc title="Privacy Policy" updated="July 2026">
      <p>This draft policy covers the Bet It Up play-money preview and is a working template for counsel to finalize before launch.</p>
      <h2>1. What we collect</h2>
      <p>In this preview, your account name, email, and activity are stored locally in your own browser. Nothing is transmitted to a server and there is no tracking or advertising.</p>
      <h2>2. What changes at launch</h2>
      <p>The production platform will store accounts, wallets, and bets on secured infrastructure, verify identity where the law requires it, and process payments through licensed providers. This policy will be replaced by a full version at that point.</p>
      <h2>3. Your controls</h2>
      <p>You can clear the preview's data at any time by clearing this site's browser storage. In production you will be able to export or delete your data on request.</p>
      <h2>4. Contact</h2>
      <p>Questions about this preview go to the build team at info@anointedcoder.com.</p>
    </Doc>
  )
}
