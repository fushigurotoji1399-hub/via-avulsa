import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/#consulta", label: "Consulta" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#prazo", label: "Prazo" },
  { href: "/#perguntas", label: "Perguntas" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-heading text-lg tracking-tight">
          <PortalMark />
          <span>ViaAvulsa</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/proposta"
          className={cn(buttonVariants({ size: "lg" }), "ml-auto h-9 px-3 md:ml-2")}
        >
          Fechar negócio
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-border/70 px-4 py-2 text-sm text-muted-foreground md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function PortalMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="text-primary">
      <rect width="28" height="28" rx="8" fill="currentColor" />
      <path d="M6 21.5V9.5h16v12" fill="none" stroke="#f4efe4" strokeWidth="1.7" />
      <path d="M6 9.5h16" stroke="#e2b34a" strokeWidth="2.2" />
    </svg>
  )
}
