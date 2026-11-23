import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { lockLeads } from "@/app/leads/actions"
import { UnlockLeadsForm } from "@/components/unlock-leads-form"
import { Button } from "@/components/ui/button"
import { databaseIsLocal } from "@/lib/db"
import { accessKeyDigest, listLeads } from "@/lib/leads"

export const metadata: Metadata = {
  title: "Leads recebidos",
  description: "Contatos enviados pelo anúncio de consulta avulsa.",
  robots: { index: false, follow: false },
}

const when = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadFallback />}>
      <LeadsContent />
    </Suspense>
  )
}

function LeadFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm text-muted-foreground">Carregando contatos…</p>
    </div>
  )
}

async function LeadsContent() {
  const local = databaseIsLocal()
  const secret = process.env.LEADS_ACCESS_KEY?.trim() ?? ""
  const jar = await cookies()
  const session = jar.get("leads_session")?.value ?? ""
  const unlocked = local || (secret !== "" && session === accessKeyDigest(secret))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Leads</p>
      <h1 className="mt-3 font-heading text-4xl">Contatos do anúncio</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Nome, WhatsApp e concessionária enviados pela home ou pela proposta. A lista não aparece para quem só abre o anúncio.
      </p>

      {unlocked ? <LeadTable local={local} /> : <div className="mt-8"><UnlockLeadsForm unconfigured={secret === ""} /></div>}
    </div>
  )
}

async function LeadTable({ local }: { local: boolean }) {
  let leads: Awaited<ReturnType<typeof listLeads>> = []
  let failed = false
  try {
    leads = await listLeads()
  } catch {
    failed = true
  }

  return (
    <div className="mt-8 space-y-4">
      {local ? (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
          Nesta máquina os contatos ficam numa base local e somem quando o servidor reinicia. Na publicação eles ficam no banco do anúncio, e a lista pede a chave.
        </p>
      ) : (
        <form action={lockLeads}>
          <Button type="submit" variant="outline">
            Sair da lista
          </Button>
        </form>
      )}
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          Não foi possível ler os contatos agora.
        </p>
      ) : leads.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
          Nenhum contato ainda. O formulário da home grava o primeiro.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-3xl bg-card ring-1 ring-foreground/10">
          {leads.map((lead) => (
            <li key={lead.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[9rem_1fr]">
              <p className="text-sm text-muted-foreground">
                {when.format(new Date(lead.createdAt))}
                <span className="mt-1 block text-xs tracking-wide uppercase">{lead.origem}</span>
              </p>
              <div>
                <p className="font-medium">{lead.nome}</p>
                <p className="text-sm">{lead.whatsapp ? formatPhone(lead.whatsapp) : "Sem WhatsApp"}</p>
                <p className="text-sm text-muted-foreground">
                  {[lead.concessionaria, lead.rodovia].filter(Boolean).join(" · ") || "Sem concessionária"}
                </p>
                {lead.mensagem ? <p className="mt-1 text-sm">{lead.mensagem}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatPhone(value: string) {
  if (value.length === 11) return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
  if (value.length === 10) return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
  return `+${value}`
}
