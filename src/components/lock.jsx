import { createContext, useContext, useState, useCallback } from 'react'
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components'
import { Lock as LockIcon, X } from 'lucide-react'
import { Button } from './primitives.jsx'
import { LOCK_MESSAGE, CREDIT } from '../lib/content.js'

const LockCtx = createContext(() => {})
export const useLock = () => useContext(LockCtx)

export function LockProvider({ children }) {
  const [page, setPage] = useState(null)
  const open = useCallback((name) => setPage(name || 'page'), [])

  return (
    <LockCtx.Provider value={open}>
      {children}
      <ModalOverlay
        isOpen={!!page}
        onOpenChange={(o) => { if (!o) setPage(null) }}
        isDismissable
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-5 backdrop-blur-md data-[entering]:opacity-0 transition-opacity duration-300"
      >
        <Modal className="w-full max-w-lg outline-none data-[entering]:translate-y-3 data-[entering]:opacity-0 transition duration-300">
          <Dialog className="relative rounded-3xl border border-strong bg-surface-raised p-8 text-center shadow-600 outline-none sm:p-11">
            {({ close }) => (
              <>
                <button onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-default bg-surface text-muted transition hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
                  <LockIcon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-warning">Part of the full build</p>
                <Heading slot="title" className="mt-3 font-display text-2xl font-bold tracking-tight text-default">
                  The <span className="text-brand">{page}</span> page comes next
                </Heading>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{LOCK_MESSAGE}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button variant="ghost" size="sm" onClick={close}>Back to homepage</Button>
                  <Button as="a" href={CREDIT.links.whatsapp} target="_blank" rel="noopener" variant="primary" size="sm" icon>Discuss this build</Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </LockCtx.Provider>
  )
}
