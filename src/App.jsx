import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LockProvider } from './components/lock.jsx'
import Announcement from './sections/Announcement.jsx'
import Nav from './sections/Nav.jsx'
import Hero from './sections/Hero.jsx'
import Ticker from './sections/Ticker.jsx'
import Markets from './sections/Markets.jsx'
import Features from './sections/Features.jsx'
import Pillars from './sections/Pillars.jsx'
import Protocol from './sections/Protocol.jsx'
import WhyGrid from './sections/WhyGrid.jsx'
import Trust from './sections/Trust.jsx'
import Faq from './sections/Faq.jsx'
import EarlyAccess from './sections/EarlyAccess.jsx'
import Footer from './sections/Footer.jsx'
import PreviewFab from './sections/PreviewFab.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => { clearTimeout(id); window.removeEventListener('load', onLoad) }
  }, [])

  return (
    <LockProvider>
      <div className="relative">
        <div className="noise-overlay" aria-hidden="true" />
        <Announcement />
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Markets />
          <Features />
          <Pillars />
          <Protocol />
          <WhyGrid />
          <Trust />
          <Faq />
          <EarlyAccess />
        </main>
        <Footer />
        <PreviewFab />
      </div>
    </LockProvider>
  )
}
