# Ela Fit — Plataforma de Treinos

Projeto React + Vite com 24 treinos interativos do Método Ela Fit.

## Estrutura

- `src/App.jsx` — rotas de todos os treinos + página inicial
- `src/treinos/` — 24 componentes React (um por treino)

## Rotas

**Iniciante 3x:** `/iniciante-3x-a`, `/iniciante-3x-b`, `/iniciante-3x-c`
**Iniciante 5x:** `/iniciante-5x-a` até `/iniciante-5x-e`
**Intermediário 3x:** `/intermediario-3x-a`, `/intermediario-3x-b`, `/intermediario-3x-c`
**Intermediário 5x:** `/intermediario-5x-a` até `/intermediario-5x-e`
**Avançado 3x:** `/avancado-3x-a`, `/avancado-3x-b`, `/avancado-3x-c`
**Avançado 5x:** `/avancado-5x-a` até `/avancado-5x-e`
**Home (índice):** `/`

## Deploy

Basta conectar o repositório no Vercel — ele detecta Vite automaticamente. O `vercel.json` já configura o roteamento SPA.

## Rodar localmente

```
npm install
npm run dev
```

## Persistência

Progresso do treino salvo em `localStorage` do navegador. Sem login, sem servidor.
