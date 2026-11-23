import type { Metadata } from "next"
import { Fraunces, Geist } from "next/font/google"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
})

function metadataBase() {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`)
  return new URL("http://localhost:3847")
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "ViaAvulsa — consulta avulsa de pedágio Free Flow",
    template: "%s · ViaAvulsa",
  },
  description:
    "Anúncio de exemplo: consulte a placa, veja o débito do Free Flow e simule o pagamento no prazo de 30 dias. Sem tag e sem cadastro.",
  openGraph: {
    title: "ViaAvulsa — consulta avulsa de pedágio Free Flow",
    description:
      "Anúncio de exemplo para concessionárias. Placa, débito e Pix simulado, sem cadastro.",
    locale: "pt_BR",
    type: "website",
    siteName: "ViaAvulsa",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
        >
          Ir para o conteúdo
        </a>
        <div className="bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
          Anúncio de exemplo para fechar negócio no Free Flow.{" "}
          <a href="/proposta" className="font-medium underline underline-offset-4">
            Abrir a proposta
          </a>
        </div>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
