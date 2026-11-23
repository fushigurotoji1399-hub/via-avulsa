import Link from "next/link"
import { Suspense } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { ConsultaPanel } from "@/components/consulta-panel"
import { LeadForm } from "@/components/lead-form"
import { SAMPLE_HINTS } from "@/lib/consulta"
import { cn } from "@/lib/utils"

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        <div className="contents lg:block">
          <div className="order-1">
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              Consulta avulsa · Free Flow
            </p>
            <h1 className="mt-3 max-w-xl font-heading text-4xl leading-[1.05] text-balance sm:text-6xl">
              Passou no pórtico sem tag? A placa resolve.
            </h1>
            <div className="mt-5 h-1 w-14 rounded-full bg-[#e2b34a]" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              O motorista informa a placa, vê a passagem e paga no prazo. Sem cadastro, sem mensalidade
              e sem parar na cancela.
            </p>
          </div>
          <ul className="order-3 mt-0 grid gap-3 text-sm sm:grid-cols-3 lg:mt-8 lg:grid-cols-1">
            {[
              ["Sem tag", "A câmera lê a placa. A consulta mostra o débito."],
              ["Até 30 dias", "Prazo geral divulgado para pagar a tarifa."],
              ["Pix na tela", "Nesta peça, o pagamento é só uma simulação."],
            ].map(([title, text]) => (
              <li key={title} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-2">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-3xl bg-card ring-1 ring-foreground/10" />}>
            <ConsultaGate searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 border-y border-border bg-card/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary uppercase">Como funciona</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl">Três passos até o débito.</h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "A placa", "Antiga ou Mercosul. A busca desta página usa só o conjunto de exemplo."],
              ["02", "A passagem", "Pórtico, horário, valor, vencimento e a situação da cobrança."],
              ["03", "O prazo", "Pendente dá para simular o Pix. Vencida pede regularização. Em processamento ainda não cobra."],
            ].map(([step, title, text]) => (
              <li key={step} className="rounded-2xl bg-background p-4 ring-1 ring-foreground/10">
                <p className="font-mono text-xs text-[#9a7420]">{step}</p>
                <p className="mt-2 font-heading text-xl">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="prazo" className="scroll-mt-24">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.18em] text-primary uppercase">Prazo</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl">O que dizer quando o cliente perguntar o prazo.</h2>
            <p className="mt-3 text-muted-foreground">
              No modelo divulgado pela ANTT para o Free Flow, o prazo geral para pagar a tarifa sem tag
              é de até 30 dias. O registro pode não aparecer no mesmo instante da passagem. Depois do
              prazo, a cobrança pode ser tratada como evasão de pedágio.
            </p>
          </div>
          <ol className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              ["Dia da passagem", "O pórtico registra a placa. Com tag, a cobrança pode ser automática."],
              ["Registro", "A tarifa pode levar um tempo até ficar disponível para consulta."],
              ["Até 30 dias", "Janela geral para quitar sem entrar em evasão."],
              ["Depois do prazo", "Regularizar no canal da concessionária. A multa e os pontos seguem a regra de trânsito vigente."],
            ].map(([title, text], index) => (
              <li key={title} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                <p className="font-mono text-xs text-muted-foreground">0{index + 1}</p>
                <p className="mt-2 font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary-foreground/70 uppercase">Na reunião</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl">Três placas, três finais.</h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Aceite os termos, escolha a placa e busque. O cliente vê débito, atraso e placa quite
              sem você sair desta página.
            </p>
          </div>
          <ul className="grid gap-3">
            {SAMPLE_HINTS.map((sample) => (
              <li key={sample.plate}>
                <Link
                  href={`/?placa=${sample.plate}#consulta`}
                  className="flex flex-col gap-1 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-mono tracking-[0.18em]">{sample.plate}</span>
                  <span className="text-sm text-primary-foreground/80">{sample.result}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="perguntas" className="scroll-mt-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="font-heading text-3xl sm:text-4xl">Perguntas da campanha.</h2>
          <Accordion>
            {faq.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Contato</p>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl">Deixe o WhatsApp e receba o retorno.</h2>
          <p className="mt-3 text-muted-foreground">
            O nome e o telefone ficam gravados neste anúncio. Não seguem para banco, concessionária ou outro site.
          </p>
          <Link href="/proposta" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 h-11 px-4")}>
            Montar a proposta da reunião
          </Link>
        </div>
        <LeadForm />
      </section>
    </>
  )
}

async function ConsultaGate({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"]
}) {
  const params = await searchParams
  const raw = params.placa
  const initialPlate = Array.isArray(raw) ? raw[0] : raw ?? ""
  return <ConsultaPanel initialPlate={initialPlate} />
}

const faq = [
  {
    q: "Precisa de tag para consultar?",
    a: "Não. A peça fala com quem passou no Free Flow e teve a placa lida pelo pórtico. Quem já tem tag segue com a cobrança automática do serviço que contratou.",
  },
  {
    q: "Quanto tempo o motorista tem para pagar?",
    a: "A regra geral divulgada pela ANTT é de até 30 dias. Os prazos de uma rodovia específica podem variar, e a página deixa isso explícito para a concessionária ajustar depois.",
  },
  {
    q: "Os débitos desta página são reais?",
    a: "Não. Concessionárias, pórticos, placas e valores são fictícios. A busca não sai do navegador e o Pix não gera cobrança.",
  },
  {
    q: "E se o motorista não reconhecer a passagem?",
    a: "No produto real, a contestação fica no canal da concessionária. Nesta demonstração, o caminho é explicar o prazo e mostrar que a placa, o pórtico e o valor aparecem juntos.",
  },
  {
    q: "Dá para colocar a marca do cliente?",
    a: "O formulário no fim da página grava nome e WhatsApp. A proposta prepara a mensagem da reunião e também registra o contato. A troca de marca entra no passo seguinte, com a concessionária.",
  },
]
