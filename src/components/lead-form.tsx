"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Status = "idle" | "saving" | "saved" | "error"

export function LeadForm() {
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [concessionaria, setConcessionaria] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus("saving")
    setError("")
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nome,
          whatsapp,
          concessionaria,
          mensagem,
          website,
          origem: "anuncio",
        }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setStatus("error")
        setError(payload?.error ?? "Não foi possível salvar o contato.")
        return
      }
      setStatus("saved")
      setNome("")
      setWhatsapp("")
      setConcessionaria("")
      setMensagem("")
    } catch {
      setStatus("error")
      setError("Não foi possível salvar o contato.")
    }
  }

  if (status === "saved") {
    return (
      <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10" role="status">
        <p className="font-heading text-2xl">Contato salvo.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          O retorno sai neste WhatsApp. A consulta de placa acima continua disponível para a reunião.
        </p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
          Enviar outro contato
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <Field id="lead-nome" label="Nome" value={nome} autoComplete="name" onChange={setNome} />
      <Field id="lead-whatsapp" label="WhatsApp" value={whatsapp} autoComplete="tel" inputMode="tel" onChange={setWhatsapp} />
      <Field
        id="lead-concessionaria"
        label="Concessionária ou rodovia"
        value={concessionaria}
        hint="Opcional"
        onChange={setConcessionaria}
      />
      <div className="space-y-1.5">
        <Label htmlFor="lead-mensagem">Mensagem</Label>
        <textarea
          id="lead-mensagem"
          value={mensagem}
          maxLength={500}
          onChange={(event) => setMensagem(event.target.value)}
          className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={status === "saving"}>
        {status === "saving" ? "Salvando contato…" : "Quero receber o retorno"}
      </Button>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  hint,
  autoComplete,
  inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  autoComplete?: string
  inputMode?: "tel" | "text"
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="h-10"
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
