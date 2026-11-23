export type PassageStatus = "pendente" | "pago" | "vencido" | "processando"

export type Passage = {
  id: string
  concessionaria: string
  rodovia: string
  portico: string
  when: string
  due: string
  amountCents: number
  status: PassageStatus
}

export const SAMPLE_PLATES = ["BRA2E19", "RIO7C30", "SAO9K77"] as const

export const SAMPLE_HINTS: { plate: string; result: string }[] = [
  {
    plate: "BRA2E19",
    result: "Duas passagens pendentes e uma já paga. Total em aberto de R$ 29,80.",
  },
  {
    plate: "RIO7C30",
    result: "Uma passagem vencida e outra ainda em processamento.",
  },
  {
    plate: "SAO9K77",
    result: "Nenhum débito. Serve para mostrar a tela vazia na reunião.",
  },
]

const SAMPLES: Record<string, Passage[]> = {
  BRA2E19: [
    {
      id: "sv-42",
      concessionaria: "Serra Verde Demonstração",
      rodovia: "BR-000",
      portico: "km 42 · Ribeira",
      when: "18 nov 2026 · 14h32",
      due: "18 dez 2026",
      amountCents: 1490,
      status: "pendente",
    },
    {
      id: "sv-67",
      concessionaria: "Serra Verde Demonstração",
      rodovia: "BR-000",
      portico: "km 67 · Laranjal",
      when: "18 nov 2026 · 15h05",
      due: "18 dez 2026",
      amountCents: 1490,
      status: "pendente",
    },
    {
      id: "le-12",
      concessionaria: "Leste Exemplo",
      rodovia: "SP-000",
      portico: "km 12 · Palmeiras",
      when: "02 nov 2026 · 09h18",
      due: "02 dez 2026",
      amountCents: 890,
      status: "pago",
    },
  ],
  RIO7C30: [
    {
      id: "vc-03",
      concessionaria: "Via do Cerrado Demonstração",
      rodovia: "PR-000",
      portico: "km 77 · Araucária",
      when: "01 out 2026 · 18h44",
      due: "31 out 2026",
      amountCents: 2190,
      status: "vencido",
    },
    {
      id: "vc-23",
      concessionaria: "Via do Cerrado Demonstração",
      rodovia: "PR-000",
      portico: "km 81 · Araucária",
      when: "23 nov 2026 · 11h02",
      due: "Aguardando processamento",
      amountCents: 1490,
      status: "processando",
    },
  ],
  SAO9K77: [],
}

export function normalizePlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7)
}

export function isValidPlate(plate: string) {
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate)
}

export function lookupPlate(plate: string): "invalid" | "unknown" | Passage[] {
  if (!isValidPlate(plate)) return "invalid"
  if (!(plate in SAMPLES)) return "unknown"
  return SAMPLES[plate].map((passage) => ({ ...passage }))
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function statusLabel(status: PassageStatus) {
  switch (status) {
    case "pendente":
      return "Pendente"
    case "pago":
      return "Paga"
    case "vencido":
      return "Vencida"
    case "processando":
      return "Em processamento"
  }
}

export function payable(status: PassageStatus) {
  return status === "pendente" || status === "vencido"
}
