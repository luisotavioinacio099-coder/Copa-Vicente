# Copa Vicente 2026 — Sincronização entre dispositivos

Este site agora salva os placares **no GitHub via API da Vercel** para que **todos os dispositivos vejam o mesmo resultado** (celular, computador, etc.).

## Como funciona

- O `index.html` busca e grava os dados na API da Vercel (`/api/ler` e `/api/salvar`).
- A API da Vercel usa o **GitHub como repositório de dados** — os resultados ficam no arquivo `data.json` do seu repositório.
- Tudo o que um usuário salva fica visível para todos, de qualquer navegador.

## Configuração necessária (faça uma única vez)

### 1. Criar um token no GitHub (Personal Access Token)

1. Acesse https://github.com/settings/tokens → **Generate new token (classic)**.
2. Marque o escopo **`repo`** (acesso total a repositórios).
3. Dê um nome (ex: `copa-dados`).
4. Copie o token gerado (só aparece uma vez).

**IMPORTANTE:** nunca compartilhe o token. Ele vai ser guardado com segurança na Vercel (variável de ambiente), **não** no código.

### 2. Garantir que existe um arquivo `data.json` no repositório

- O arquivo `data.json` (na raiz) já está incluído neste projeto. Ele é criado por você.

### 3. Configurar as variáveis de ambiente na Vercel

No painel da Vercel (Project → Settings → Environment Variables), adicione:

| Nome | Valor |
|------|-------|
| `GITHUB_TOKEN` | o token criado no passo 1 |
| `GITHUB_OWNER` | seu nome de usuário no GitHub |
| `GITHUB_REPO` | nome do repositório (ex: `Copa-Vicente`) |
| `GITHUB_BRANCH` | `main` |
| `ADMIN_PASSWORD` | a senha de administrador do site (ex: `sis2026`) |

Depois de adicionar, faça um novo **Deploy** (ou Redeploy) para as variáveis valerem.

### 4. Verificar o funcionamento

- Abra o site, clique em **Registrar Partida**, digite a senha de admin e salve um placar.
- Abra em outro navegador/celular → o placar estará lá.

## Atenção: token gravado no repositório

O arquivo `api/salvar.js` não contém o token (ele vem de `process.env.GITHUB_TOKEN`). **Nunca** coloque o token no código.

## Reverter (opcional)

Se algum dia quiser voltar ao modo local (sem compartilhamento), restaure as funções `saveState`/`loadState` originais, que usavam `localStorage`.
