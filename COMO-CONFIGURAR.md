# Copa Vicente 2026 — Sincronização entre dispositivos

Este site salva os placares **no Supabase (banco de dados)** para que **todos os dispositivos vejam o mesmo resultado** (celular, computador, etc.).

## Como funciona

- O `index.html` busca e grava os dados na API da Vercel (`/api/ler` e `/api/salvar`).
- A API da Vercel usa o **Supabase** como banco de dados — os resultados ficam na tabela `copa_dados` do seu projeto.
- Tudo o que um usuário salva fica visível para todos, de qualquer navegador.

## Configuração necessária (faça uma única vez)

### 1. Criar a tabela no Supabase

1. Acesse o painel do Supabase em https://supabase.com/dashboard e abra o seu projeto.
2. Vá em **SQL Editor** → **New query**.
3. Cole o conteúdo do arquivo `SUPABASE-SETUP.sql` e clique em **Run**.
   - Isso cria a tabela `copa_dados` que guarda o estado do torneio.

### 2. Configurar as variáveis de ambiente na Vercel

No painel da Vercel (Project → Settings → Environment Variables), adicione:

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | a URL do seu projeto (ex: `https://ixtnamaebslqysxxbtoh.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | a **service role key** do projeto (Settings → API → service_role) |
| `ADMIN_PASSWORD` | a senha de administrador do site (ex: `sis2026`) |

> **IMPORTANTE:** use a **service role key** (chave secreta), **não** a anon/public. Ela só deve ficar na variável de ambiente da Vercel, **nunca** no código ou no navegador.

Depois de adicionar, faça um novo **Deploy** (ou Redeploy) para as variáveis valerem.

### 3. Migrar os dados atuais (opcional, mas recomendado)

Se já havia placares salvos, rode o script que insere o estado atual do `data.json` na tabela:
```bash
node api/migrar.js
```
(Configure antes as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente ou num arquivo `.env`.)

### 4. Verificar o funcionamento

- Abra o site, clique em **Registrar Partida**, digite a senha de admin e salve um placar.
- Abra em outro navegador/celular → o placar estará lá.

## Atenção: chaves nunca no código

As chaves do Supabase vêm de `process.env.SUPABASE_URL` e `process.env.SUPABASE_SERVICE_ROLE_KEY`. **Nunca** coloque a service role key no código ou no `index.html`.

## Reverter (opcional)

Se algum dia quiser voltar ao modo local (sem compartilhamento), restaure as funções `saveState`/`loadState` originais, que usavam `localStorage`.
