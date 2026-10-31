import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_LINKS } from '@/consts'
import { Menu, X } from 'lucide-react'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleViewTransitionStart = () => {
      setIsOpen(false)
    }

    document.addEventListener('astro:before-swap', handleViewTransitionStart)

    return () => {
      document.removeEventListener(
        'astro:before-swap',
        handleViewTransitionStart,
      )
    }
  }, [])

  return (
    <div className="flex items-center sm:hidden">
      <DropdownMenu open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted/40 border-border/40 text-foreground focus-visible:ring-foreground relative size-9 rounded-md border transition-colors focus-visible:ring-1"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="border-border bg-background/95 w-48 rounded-lg border p-1.5 shadow-xl backdrop-blur-md"
        >
          {NAV_LINKS.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <a
                href={item.href}
                className="hover:bg-muted/50 hover:text-foreground text-foreground/80 flex w-full cursor-pointer items-center rounded-md px-3 py-2 font-mono text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MobileMenu
