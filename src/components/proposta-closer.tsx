"use client"

import { useState, type FormEvent, type HTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Fields = {
  remetente: string
  contato: string
  concessionaria: string
  rodovia: string
  whatsapp: string
}

const empty: Fields = {
  remetente: "",
  contato: "",
  concessionaria: "",
  rodovia: "",
  whatsapp: "",
}

export function PropostaCloser({ originPath = "/" }: { originPath?: string }) {
  const [fields, setFields] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [message, setMessage] = useState("")
  const [link, setLink] = useState("")
  const [copied, setCopied] = useState<"link" | "mensagem" | "">("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function adLink() {
    if (typeof window === "undefined") return originPath
    return `${window.location.origin}/`
  }

  async function copy(value: string, kind: "link" | "mensagem") {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
    } catch {
      setCopied("")
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Partial<Fields> = {}
    if (fields.remetente.trim().length < 2) nextErrors.remetente = "Diga quem envia a mensagem."
    if (fields.contato.trim().length < 2) nextErrors.contato = "Diga o nome de quem recebe."
    if (fields.concessionaria.trim().length < 2) {
      nextErrors.concessionaria = "Informe a concessionária da reunião."
    }
    const digits = fields.whatsapp.replace(/\D/g, "")
    if (fields.whatsapp.trim() && (digits.length < 10 || digits.length > 13)) {
      nextErrors.whatsapp = "Use DDD e número, com 10 a 13 dígitos."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setMessage("")
      return
    }

    const url = adLink()
    const rodovia = fields.rodovia.trim()
    const text = [
      `Olá, ${fields.contato.trim()}. Aqui é ${fields.remetente.trim()}.`,
      "",
      `Preparei um anúncio de exemplo de consulta avulsa para a ${fields.concessionaria.trim()}${rodovia ? ` (${rodovia})` : ""}. O motorista digita a placa, vê a passagem do Free Flow e o prazo para pagar — sem tag e sem cadastro.`,
      "",
      `Link: ${url}`,
      "Na reunião, use as placas BRA2E19, RIO7C30 e SAO9K77.",
      "",
      "Se fizer sentido, colocamos a marca de vocês nesta mesma página.",
    ].join("\n")
    setLink(url)
    setMessage(text)
    setCopied("")
    setSaving(true)
    setSaved(false)
    setSaveError("")
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nome: fields.contato.trim(),
          whatsapp: fields.whatsapp,
          concessionaria: fields.concessionaria.trim(),
          rodovia: fields.rodovia.trim(),
          mensagem: `Remetente: ${fields.remetente.trim()}`,
          origem: "proposta",
          website: "",
        }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setSaveError(payload?.error ?? "Não foi possível salvar o contato.")
        return
      }
      setSaved(true)
    } catch {
      setSaveError("Não foi possível salvar o contato.")
    } finally {
      setSaving(false)
    }
  }

  const digits = fields.whatsapp.replace(/\D/g, "")
  const whatsappHref =
    message && digits.length >= 10 && digits.length <= 13
      ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
      : ""

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6" noValidate>
        <div>
          <h2 className="font-heading text-2xl">Mensagem para mandar agora</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A mensagem fica pronta para copiar, e o contato da concessionária entra na lista de leads.
          </p>
        </div>
        <Field
          id="remetente"
          label="Seu nome"
          value={fields.remetente}
          error={errors.remetente}
          onChange={(value) => update("remetente", value)}
        />
        <Field
          id="contato"
          label="Nome do contato"
          value={fields.contato}
          error={errors.contato}
          onChange={(value) => update("contato", value)}
        />
        <Field
          id="concessionaria"
          label="Concessionária"
          value={fields.concessionaria}
          error={errors.concessionaria}
          onChange={(value) => update("concessionaria", value)}
        />
        <Field
          id="rodovia"
          label="Rodovia ou praça"
          value={fields.rodovia}
          hint="Opcional"
          onChange={(value) => update("rodovia", value)}
        />
        <Field
          id="whatsapp"
          label="WhatsApp do contato"
          value={fields.whatsapp}
          error={errors.whatsapp}
          hint="Opcional. Só abre o aplicativo no seu celular."
          inputMode="tel"
          autoComplete="tel"
          onChange={(value) => update("whatsapp", value)}
        />
        {saveError ? (
          <p role="alert" className="text-sm text-destructive">
            {saveError}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={saving}>
          {saving ? "Salvando contato…" : "Montar mensagem"}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground sm:p-6">
          <p className="text-xs tracking-[0.16em] text-primary-foreground/75 uppercase">
            Link do anúncio
          </p>
          <p className="mt-3 font-heading text-2xl leading-tight">
            Mande a home. As três placas fazem a demonstração.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-5"
            onClick={() => copy(adLink(), "link")}
          >
            {copied === "link" ? "Link copiado" : "Copiar link da home"}
          </Button>
          {link ? <p className="mt-3 text-sm break-all text-primary-foreground/85">{link}</p> : null}
        </div>

        {message ? (
          <div className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {saved ? "Pronta para enviar · contato salvo" : "Pronta para enviar"}
            </p>
            <pre className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">{message}</pre>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={() => copy(message, "mensagem")}>
                {copied === "mensagem" ? "Mensagem copiada" : "Copiar mensagem"}
              </Button>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted"
                >
                  Abrir no WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
            A mensagem aparece aqui, com o link desta publicação e as placas da reunião.
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  inputMode,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-erro` : hint ? `${id}-dica` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-10"
      />
      {error ? (
        <p id={`${id}-erro`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-dica`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
