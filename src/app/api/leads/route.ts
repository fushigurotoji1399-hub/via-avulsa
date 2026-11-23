import { NextResponse } from "next/server"
import { parseLead, saveLead } from "@/lib/leads"

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!origin || !host) {
    return NextResponse.json({ error: "Envio recusado." }, { status: 403 })
  }
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "Envio recusado." }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: "Envio recusado." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Envie os dados do contato." }, { status: 400 })
  }

  const parsed = parseLead(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const result = await saveLead(parsed.value)
    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 429 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar o contato." }, { status: 500 })
  }
}
