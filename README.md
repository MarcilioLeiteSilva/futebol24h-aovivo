# ⚽ Copa do Mundo FIFA 2026 — Plataforma de Transmissão 24h

Plataforma completa para transmissão ao vivo da Copa do Mundo FIFA 2026 via OBS → YouTube Live.

## 🎬 Páginas / Cenas OBS

| Página | URL | Uso |
|---|---|---|
| `index.html` | `/` | Countdown + Grupos (cena de espera) |
| `agenda.html` | `/agenda` | Agenda completa — 104 jogos |
| `placar.html` | `/placar` | Placar ao vivo (auto-refresh 30s) |
| `classificacao.html` | `/classificacao` | Tabela dos 12 grupos |
| `noticias.html` | `/noticias` | Card de notícias com transição rotativa |
| `curiosidades.html` | `/curiosidades` | Curiosidade do dia animada |
| `overlay-ticker.html` | `/overlay-ticker` | 🔲 Faixa rodapé transparente |
| `overlay-placar.html` | `/overlay-placar` | 🔲 Mini placar transparente (canto) |

## 🔌 API

Dados em tempo real via **ZapScore API** — Copa do Mundo FIFA 2026 completa.

## 📋 Conteúdo dinâmico (Google Sheets)

Configure as URLs das planilhas em `config.js`:
- `SHEETS.noticias` — Notícias do dia
- `SHEETS.curiosidades` — Curiosidades
- `SHEETS.ticker` — Frases para a faixa rodapé

## 🚀 Deploy

Hospedado no **Netlify** com deploy automático via GitHub.

## 🇺🇸🇨🇦🇲🇽 Copa 2026

- 48 seleções · 104 jogos · 16 cidades-sede
- Abertura: 11 de Junho · Estádio Azteca · Cidade do México
- Final: 19 de Julho · MetLife Stadium · Nova York
