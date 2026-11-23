import { ImageResponse } from "next/og"

export const alt = "ViaAvulsa, consulta avulsa de pedágio Free Flow"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#143528",
          color: "#f6f1e6",
          padding: "72px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 3 }}>
          VIAAVULSA · ANÚNCIO DE EXEMPLO
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, maxWidth: 920 }}>
          Passou no pórtico sem tag? Consulte a placa.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#e2b34a" }}>
          Free Flow · sem cadastro · prazo de 30 dias
        </div>
      </div>
    ),
    { ...size }
  )
}
