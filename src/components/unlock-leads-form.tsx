"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { unlockLeads } from "@/app/leads/actions"

export function UnlockLeadsForm({ unconfigured }: { unconfigured: boolean }) {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    const result = await unlockLeads(key)
    setPending(false)
    if (!result.ok) {
      setError(
        result.reason === "unconfigured"
          ? "A chave de acesso ainda não está na publicação. Os contatos continuam sendo gravados."
          : "Chave não confere.",
      )
      return
    }
    window.location.reload()
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
      <div>
        <h2 className="font-heading text-2xl">Abrir a lista</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {unconfigured
            ? "Defina LEADS_ACCESS_KEY nos segredos da publicação. A mesma chave abre esta lista."
            : "Use a chave LEADS_ACCESS_KEY desta publicação."}
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="chave">Chave</Label>
        <Input
          id="chave"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          className="h-10"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11">
        {pending ? "Conferindo…" : "Ver leads"}
      </Button>
    </form>
  )
}
