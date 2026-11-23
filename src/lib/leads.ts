import { createHash, timingSafeEqual } from "node:crypto"
import { sql } from "@/lib/db"

export type LeadOrigin = "anuncio" | "proposta"

export type LeadRecord = {
  id: string
  nome: string
  whatsapp: string
  concessionaria: string
  rodovia: string
  mensagem: string
  origem: string
  createdAt: string
}

type LeadInput = {
  nome: string
  whatsapp: string
  concessionaria: string
  rodovia: string
  mensagem: string
  origem: LeadOrigin
  website: string
}

export function accessKeyDigest(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function accessKeysMatch(input: string, secret: string) {
  const given = Buffer.from(accessKeyDigest(input))
  const expected = Buffer.from(accessKeyDigest(secret))
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function parseLead(body: unknown): { ok: true; value: LeadInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Envie os dados do contato." }
  const record = body as Record<string, unknown>
  const nome = clean(record.nome, 80)
  const whatsapp = digits(record.whatsapp).slice(0, 13)
  const concessionaria = clean(record.concessionaria, 120)
  const rodovia = clean(record.rodovia, 120)
  const mensagem = clean(record.mensagem, 500)
  const website = clean(record.website, 200)
  const origem = record.origem === "proposta" ? "proposta" : "anuncio"

  if (origem === "anuncio") {
    if (nome.length < 2) return { ok: false, error: "Informe o nome." }
    if (whatsapp.length < 10 || whatsapp.length > 13) {
      return { ok: false, error: "Informe o WhatsApp com DDD." }
    }
  } else if (nome.length < 2 || concessionaria.length < 2) {
    return { ok: false, error: "Informe o contato e a concessionária." }
  }

  return {
    ok: true,
    value: { nome, whatsapp, concessionaria, rodovia, mensagem, origem, website },
  }
}

export async function saveLead(input: LeadInput) {
  if (input.website !== "") return { saved: false as const }
  const recent = await sql<{ total: number }>(
    "select count(*)::int as total from leads where created_at > now() - interval '1 minute'",
  )
  if (Number(recent[0]?.total ?? 0) >= 30) {
    return { saved: false as const, error: "Muitos envios agora. Tente de novo em instantes." }
  }
  if (input.whatsapp !== "") {
    const sameNumber = await sql<{ total: number }>(
      "select count(*)::int as total from leads where whatsapp = $1 and created_at > now() - interval '1 hour'",
      [input.whatsapp],
    )
    if (Number(sameNumber[0]?.total ?? 0) >= 5) {
      return { saved: false as const, error: "Este WhatsApp já foi enviado. Vamos retornar por ele." }
    }
  }
  await sql(
    `insert into leads (nome, whatsapp, concessionaria, rodovia, mensagem, origem)
     values ($1, $2, $3, $4, $5, $6)`,
    [input.nome, input.whatsapp, input.concessionaria, input.rodovia, input.mensagem, input.origem],
  )
  return { saved: true as const }
}

export async function listLeads(): Promise<LeadRecord[]> {
  const rows = await sql<{
    id: string | number
    nome: string
    whatsapp: string
    concessionaria: string
    rodovia: string
    mensagem: string
    origem: string
    created_at: string | Date
  }>(
    `select id, nome, whatsapp, concessionaria, rodovia, mensagem, origem, created_at
     from leads
     order by created_at desc
     limit 200`,
  )
  return rows.map((row) => ({
    id: String(row.id),
    nome: row.nome,
    whatsapp: row.whatsapp,
    concessionaria: row.concessionaria,
    rodovia: row.rodovia,
    mensagem: row.mensagem,
    origem: row.origem,
    createdAt: new Date(row.created_at).toISOString(),
  }))
}

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max)
}

function digits(value: unknown) {
  if (typeof value !== "string") return ""
  return value.replace(/\D/g, "")
}
