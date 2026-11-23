"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SAMPLE_PLATES,
  formatBRL,
  isValidPlate,
  lookupPlate,
  normalizePlate,
  payable,
  statusLabel,
  type Passage,
  type PassageStatus,
} from "@/lib/consulta"
import { cn } from "@/lib/utils"

type Phase = "idle" | "loading" | "ready"

export function ConsultaPanel({ initialPlate = "" }: { initialPlate?: string }) {
  const [plate, setPlate] = useState(() => normalizePlate(initialPlate))
  const [accepted, setAccepted] = useState(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const [error, setError] = useState("")
  const [queried, setQueried] = useState("")
  const [passages, setPassages] = useState<Passage[] | null>(null)
  const [notice, setNotice] = useState("")
  const [paying, setPaying] = useState<Passage | null>(null)
  const [receipt, setReceipt] = useState("")

  const openCents = useMemo(() => {
    if (!passages) return 0
    return passages
      .filter((passage) => payable(passage.status))
      .reduce((sum, passage) => sum + passage.amountCents, 0)
  }, [passages])

  function search(nextPlate = plate) {
    const normalized = normalizePlate(nextPlate)
    setPlate(normalized)
    setNotice("")
    setReceipt("")
    if (!accepted) {
      setError("Aceite os termos da demonstração para buscar.")
      setPhase("idle")
      setPassages(null)
      return
    }
    if (!isValidPlate(normalized)) {
      setError("Use a placa antiga (ABC1234) ou Mercosul (ABC1D23).")
      setPhase("idle")
      setPassages(null)
      return
    }
    setError("")
    setPhase("loading")
    window.setTimeout(() => {
      const found = lookupPlate(normalized)
      setQueried(normalized)
      if (found === "invalid") {
        setError("Use a placa antiga (ABC1234) ou Mercosul (ABC1D23).")
        setPassages(null)
        setPhase("idle")
        return
      }
      if (found === "unknown") {
        setPassages(null)
        setNotice("unknown")
        setPhase("ready")
        return
      }
      setPassages(found)
      setNotice(found.length === 0 ? "empty" : "")
      setPhase("ready")
    }, 650)
  }

  function simulatePayment() {
    if (!paying) return
    const id = paying.id
    setPassages((current) =>
      current?.map((passage) =>
        passage.id === id ? { ...passage, status: "pago" } : passage
      ) ?? current
    )
    setReceipt(`VIA-${id.toUpperCase()}-EXEMPLO`)
  }

  return (
    <div id="consulta" className="scroll-mt-24">
      <form
        className="overflow-hidden rounded-3xl bg-card shadow-[0_24px_60px_-32px_rgba(20,40,30,0.45)] ring-1 ring-foreground/10"
        onSubmit={(event) => {
          event.preventDefault()
          search()
        }}
      >
        <div className="flex items-center justify-between bg-primary px-5 py-3 text-primary-foreground">
          <p className="text-sm font-medium">Buscar débitos</p>
          <p className="text-xs tracking-wide text-primary-foreground/80">Sem cadastro</p>
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="placa">Placa do veículo</Label>
            <div className="overflow-hidden rounded-xl border-2 border-foreground bg-white">
              <div className="flex items-center justify-between bg-[#123a86] px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-white">
                <span>BRASIL</span>
                <span>EXEMPLO</span>
              </div>
              <Input
                id="placa"
                name="placa"
                value={plate}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "placa-erro" : "placa-ajuda"}
                placeholder="ABC1D23"
                onChange={(event) => {
                  setPlate(normalizePlate(event.target.value))
                  if (error) setError("")
                }}
                className="h-16 rounded-none border-0 bg-white text-center font-mono text-3xl tracking-[0.28em] text-foreground shadow-none focus-visible:ring-0 md:text-3xl"
              />
            </div>
            <p id="placa-ajuda" className="text-xs text-muted-foreground">
              Placas de exemplo: toque para preencher.
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PLATES.map((sample) => (
                <Button
                  key={sample}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn("font-mono tracking-wider", plate === sample && "bg-secondary")}
                  onClick={() => {
                    setPlate(sample)
                    setError("")
                  }}
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox
              id="termos"
              checked={accepted}
              onCheckedChange={(checked) => {
                setAccepted(checked)
                if (checked) setError("")
              }}
              aria-invalid={error.startsWith("Aceite")}
            />
            <p className="text-sm leading-snug text-muted-foreground">
              <label
                htmlFor="termos"
                className="cursor-pointer"
                onClick={(event) => {
                  event.preventDefault()
                  setError("")
                  setAccepted((current) => !current)
                }}
              >
                Li e aceito os termos desta demonstração.
              </label>{" "}
              <Dialog>
                <DialogTrigger
                  render={
                    <button
                      type="button"
                      className="font-medium text-foreground underline underline-offset-4"
                    />
                  }
                >
                  Ler termos
                </DialogTrigger>
                <TermsDialog />
              </Dialog>
            </p>
          </div>

          {error ? (
            <p id="placa-erro" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-base"
            disabled={phase === "loading"}
          >
            {phase === "loading" ? "Buscando débitos…" : "Buscar débitos"}
          </Button>
        </div>
      </form>

      <div className="mt-4" aria-live="polite">
        {phase === "ready" && notice === "unknown" ? (
          <ResultShell title={`Placa ${queried}`}>
            <p>
              Esta placa não está no conjunto de exemplo. Na reunião, use BRA2E19, RIO7C30 ou
              SAO9K77.
            </p>
          </ResultShell>
        ) : null}

        {phase === "ready" && notice === "empty" ? (
          <ResultShell title={`Placa ${queried}`}>
            <p className="font-heading text-xl text-foreground">Nenhum débito em aberto.</p>
            <p className="mt-1">
              Nesta demonstração a placa está quite. O motorista vê a confirmação e segue viagem.
            </p>
          </ResultShell>
        ) : null}

        {phase === "ready" && passages && passages.length > 0 ? (
          <section className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  Placa {queried}
                </p>
                <h2 className="font-heading text-2xl">Passagens de exemplo</h2>
              </div>
              <p className="text-right">
                <span className="block text-xs text-muted-foreground">Em aberto</span>
                <span className="font-heading text-2xl">{formatBRL(openCents)}</span>
              </p>
            </div>
            <ul className="divide-y divide-border">
              {passages.map((passage) => (
                <li key={passage.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <StatusBadge status={passage.status} />
                      <span className="text-xs text-muted-foreground">{passage.concessionaria}</span>
                    </div>
                    <p className="font-medium">
                      {passage.rodovia} · {passage.portico}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {passage.when}
                      {passage.status !== "processando" ? ` · vence ${passage.due}` : " · cobrança ainda não disponível"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="font-heading text-xl">{formatBRL(passage.amountCents)}</p>
                    {payable(passage.status) ? (
                      <Button type="button" size="sm" onClick={() => { setPaying(passage); setReceipt("") }}>
                        Simular Pix
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {passage.status === "pago" ? "Quitada na demo" : "Aguarde o processamento"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <Dialog
        open={paying !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPaying(null)
            setReceipt("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {paying ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {receipt ? "Pagamento simulado" : "Pix de demonstração"}
                </DialogTitle>
                <DialogDescription>
                  {paying.rodovia} · {paying.portico}. Nenhum valor sai da conta e nenhum código é
                  enviado a banco.
                </DialogDescription>
              </DialogHeader>
              {receipt ? (
                <div className="rounded-xl bg-secondary px-4 py-3">
                  <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    Comprovante de exemplo
                  </p>
                  <p className="mt-1 font-mono text-sm">{receipt}</p>
                  <p className="mt-2 font-heading text-2xl">{formatBRL(paying.amountCents)}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-heading text-2xl">{formatBRL(paying.amountCents)}</span>
                  </div>
                  <div className="grid grid-cols-[88px_1fr] gap-3 rounded-xl bg-muted p-3">
                    <DecorativeQr />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Copia e cola ilustrativo</p>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed break-all">
                        00020126VIAVULSAEXEMPLO{paying.id}530398654{paying.amountCents}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                {receipt ? (
                  <Button type="button" onClick={() => { setPaying(null); setReceipt("") }}>
                    Voltar aos débitos
                  </Button>
                ) : (
                  <Button type="button" onClick={simulatePayment}>
                    Simular pagamento
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TermsDialog() {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Termos desta demonstração</DialogTitle>
        <DialogDescription>
          A busca acontece neste navegador, com placas fictícias. Não há consulta a concessionária,
          órgão de trânsito ou instituição de pagamento.
        </DialogDescription>
      </DialogHeader>
      <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
        <li>Os débitos, pórticos e valores são inventados para o anúncio.</li>
        <li>O Pix é ilustrativo. O botão só muda o status na tela.</li>
        <li>Nada do que você digita é gravado em servidor.</li>
      </ul>
    </DialogContent>
  )
}

function ResultShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function StatusBadge({ status }: { status: PassageStatus }) {
  const variant = status === "vencido" ? "destructive" : status === "pago" ? "default" : "secondary"
  return <Badge variant={variant}>{statusLabel(status)}</Badge>
}

function DecorativeQr() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 1, 0, 1,
    1, 1, 0, 1, 1, 0, 1, 0,
    0, 1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 0, 0, 1, 1,
    0, 1, 0, 1, 1, 0, 1, 0,
    1, 1, 1, 0, 0, 1, 1, 1,
    1, 0, 1, 1, 1, 0, 0, 1,
  ]
  return (
    <svg viewBox="0 0 8 8" className="size-[88px] rounded-md bg-white p-1" aria-hidden="true">
      {cells.map((cell, index) =>
        cell ? (
          <rect
            key={index}
            x={index % 8}
            y={Math.floor(index / 8)}
            width="1"
            height="1"
            fill="#143528"
          />
        ) : null
      )}
    </svg>
  )
}
