import { useState, useEffect, useCallback } from 'react'
import { NAV_LINKS } from '@/consts'
import {
  Menu,
  X,
  ChevronRight,
  Mail,
  Award,
} from 'lucide-react'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }

    const handlePageNavigation = () => {
      setIsOpen(false)
      if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname)
      }
    }

    // Astro View Transitions handlers
    document.addEventListener('astro:before-swap', handlePageNavigation)
    document.addEventListener('astro:page-load', handlePageNavigation)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('astro:before-swap', handlePageNavigation)
      document.removeEventListener('astro:page-load', handlePageNavigation)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Safely manage body scroll lock without leaving residual styles
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isOpen])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const isActive = (href: string) => {
    if (!currentPath) return false
    if (href === '/' && currentPath === '/') return true
    if (href !== '/' && currentPath.startsWith(href)) return true
    return false
  }

  return (
    <div className="flex items-center sm:hidden">
      {/* Header Trigger Button */}
      <button
        type="button"
        onClick={toggleMenu}
        className="hover:bg-muted/50 border-border/60 text-foreground relative flex size-9 items-center justify-center rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
      >
        {isOpen ? (
          <X className="size-4.5 transition-transform duration-200" />
        ) : (
          <Menu className="size-4.5 transition-transform duration-200" />
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Half-Screen Smooth Drawer Popup */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed inset-x-0 top-0 z-50 flex max-h-[80vh] flex-col rounded-b-3xl border-b border-border bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out sm:hidden ${
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        {/* Drawer Header Row */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
              // Navigation
            </span>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="hover:bg-muted/60 text-foreground/80 hover:text-foreground flex size-8 items-center justify-center rounded-md border border-border/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            aria-label="Close navigation menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation Links List */}
        <nav className="flex flex-col gap-1 overflow-y-auto px-4 py-3">
          {NAV_LINKS.map((item, index) => {
            const active = isActive(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`group flex min-h-[48px] items-center justify-between rounded-xl px-4 py-2.5 font-mono text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                    : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground/70 font-mono text-xs">
                    0{index + 1}
                  </span>
                  <span className="capitalize">{item.label}</span>
                </div>
                <ChevronRight
                  className={`size-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    active ? 'text-primary' : 'text-muted-foreground/60'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        {/* Quick Social & Contact Row */}
        <div className="mt-auto border-t border-border/40 bg-muted/20 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground">
              Darwin Danish
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/darwindanish"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted hover:text-foreground text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-border/40 transition-colors"
                aria-label="GitHub Profile"
              >
                <svg
                  className="size-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/darwin-danish"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted hover:text-foreground text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-border/40 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <svg
                  className="size-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://orcid.org/0009-0000-1047-4320"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted hover:text-foreground text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-border/40 transition-colors"
                aria-label="ORCID Profile"
              >
                <Award className="size-4" />
              </a>
              <a
                href="mailto:darwindanish.work@gmail.com"
                className="hover:bg-muted hover:text-foreground text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-border/40 transition-colors"
                aria-label="Email Darwin Danish"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
