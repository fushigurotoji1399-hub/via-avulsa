"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { accessKeyDigest, accessKeysMatch } from "@/lib/leads"

export async function unlockLeads(key: string) {
  const secret = process.env.LEADS_ACCESS_KEY?.trim() ?? ""
  const given = key.trim().slice(0, 200)
  if (secret === "") return { ok: false as const, reason: "unconfigured" as const }
  if (given === "" || !accessKeysMatch(given, secret)) {
    return { ok: false as const, reason: "denied" as const }
  }
  const jar = await cookies()
  jar.set("leads_session", accessKeyDigest(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
  return { ok: true as const }
}

export async function lockLeads() {
  const jar = await cookies()
  jar.delete("leads_session")
  redirect("/leads")
}
