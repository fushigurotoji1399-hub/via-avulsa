import type { Metadata } from "next"
import Link from "next/link"
import { PropostaCloser } from "@/components/proposta-closer"
import { SAMPLE_HINTS } from "@/lib/consulta"

export const metadata: Metadata = {
  title: "Proposta para fechar",
  description:
    "Anúncio de exemplo de consulta avulsa para concessionárias de pedágio Free Flow. Link, placas de demonstração e mensagem pronta.",
}

const entregas = [
  "Landing de campanha com a consulta na primeira dobra, no celular e no desktop.",
  "Placa antiga e Mercosul, com termos antes da busca.",
  "Estados que a reunião precisa: pendente, paga, vencida, em processamento e sem débito.",
  "Pix ilustrativo, com comprovante só na tela.",
  "Prazo de 30 dias explicado com a ressalva da ANTT.",
  "Prévia do link para WhatsApp, com título e imagem de compartilhamento.",
  "Formulário que grava nome, WhatsApp e concessionária na lista de leads.",
]

export default function PropostaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
        Proposta · anúncio de exemplo
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-[1.05] text-balance sm:text-5xl">
        O link que você manda hoje para fechar a concessionária.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        A home é a campanha. Você aceita os termos, busca as três placas e o cliente vê a consulta
        avulsa funcionando. A mensagem fica pronta aqui, e o contato é gravado na lista de leads.
      </p>

      <ol className="mt-8 grid gap-3 md:grid-cols-3">
        {[
          ["Abra a home", "O anúncio cabe numa tela de celular. A consulta está no topo."],
          ["Rode as placas", "BRA2E19 cobra, RIO7C30 atrasa, SAO9K77 está quite."],
          ["Mande o link", "A mensagem abaixo já cita a concessionária e as placas da reunião."],
        ].map(([title, text], index) => (
          <li key={title} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <p className="font-mono text-xs text-[#9a7420]">0{index + 1}</p>
            <p className="mt-2 font-heading text-xl">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <PropostaCloser />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl">O que a peça já entrega</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {entregas.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#e2b34a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link href="/#consulta" className="mt-5 inline-block text-sm font-medium underline underline-offset-4">
            Voltar para o anúncio
          </Link>
        </div>
        <div className="rounded-3xl bg-secondary p-5 sm:p-6">
          <h2 className="font-heading text-2xl">Roteiro de um minuto</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            “Vocês já cobram no pórtico. Quem passa sem tag sai com a placa lida e um prazo para
            pagar. Esta página é a consulta avulsa: a placa entra, o débito aparece, o Pix fica na
            mesma tela. Posso mostrar agora com três placas de exemplo e, no passo seguinte, colocar
            a marca de vocês.”
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {SAMPLE_HINTS.map((sample) => (
              <li key={sample.plate}>
                <Link href={`/?placa=${sample.plate}#consulta`} className="hover:underline">
                  <span className="font-mono">{sample.plate}</span>
                  <span className="text-muted-foreground"> — {sample.result}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
