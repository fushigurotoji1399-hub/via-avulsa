import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-heading text-base text-foreground">ViaAvulsa</p>
          <div className="flex gap-4">
            <Link href="/#consulta" className="hover:text-foreground">
              Consulta
            </Link>
            <Link href="/proposta" className="hover:text-foreground">
              Proposta
            </Link>
            <Link href="/leads" className="hover:text-foreground">
              Leads
            </Link>
          </div>
        </div>
        <p className="max-w-3xl leading-relaxed">
          Anúncio de exemplo para o ramo de pedágio Free Flow. A ViaAvulsa não é canal oficial de
          concessionária, não consulta base real de passagens e não processa pagamento. Placas,
          pórticos e valores existem só para a demonstração.
        </p>
      </div>
    </footer>
  )
}
