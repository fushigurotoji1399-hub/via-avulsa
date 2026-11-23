# ViaAvulsa

Anúncio de consulta avulsa para o pedágio Free Flow, com coleta de contatos. A home mostra a placa, débitos fictícios e o Pix simulado, e grava nome e WhatsApp de quem pede retorno. A proposta monta a mensagem da reunião e também registra o contato.

Nada aqui consulta base real de passagem e nada cobra de verdade. As placas de demonstração são `BRA2E19`, `RIO7C30` e `SAO9K77`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3847](http://localhost:3847). Nesta máquina os contatos ficam numa base local, visíveis em [http://localhost:3847/leads](http://localhost:3847/leads), e somem quando o servidor reinicia.

## Publicação

O anúncio publicado usa o banco Postgres da própria publicação. A lista em `/leads` só abre com a chave `LEADS_ACCESS_KEY`, definida nos segredos da publicação. Os envios continuam sendo gravados mesmo antes da chave existir.

## O que mostrar na reunião

- `BRA2E19` — duas passagens pendentes e uma paga.
- `RIO7C30` — uma vencida e outra em processamento.
- `SAO9K77` — nenhum débito.
