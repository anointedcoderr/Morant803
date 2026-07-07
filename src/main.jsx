import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { EngineProvider } from './engine/index.jsx'
import Trade from './app/Trade.jsx'
import Wallet from './app/Wallet.jsx'
import Leaderboard from './app/Leaderboard.jsx'
import Admin from './app/Admin.jsx'
import Responsible from './app/Responsible.jsx'
import { Login, Signup } from './app/Auth.jsx'
import { Terms, Privacy } from './app/Docs.jsx'

function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-page px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand">404</p>
      <h1 className="font-display text-3xl font-bold text-default">That corner is empty</h1>
      <p className="max-w-sm text-sm text-muted">The page you are looking for is not on the card. Head back and pick a fight.</p>
      <Link to="/" className="mt-2 rounded-full bg-brand px-6 py-3 font-display text-sm font-semibold text-on-brand">Back to Bet It Up</Link>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EngineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/app" element={<Trade />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/responsible" element={<Responsible />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </EngineProvider>
  </StrictMode>,
)
