# GUIA RÁPIDO — FAZER FUNCIONAR (você precisa fazer, no navegador)

Siga em ordem. Sem esses 3 passos, os placares NÃO são compartilhados entre dispositivos.

---

## PASSO 1 — Criar o token no GitHub (10 min, única vez)

1. Entre em https://github.com/login e faça login.
2. Clique na sua foto (canto superior direito) → **Settings**.
3. Role até o final da barra lateral esquerda → **Developer settings**.
4. Clique em **Personal access tokens** → **Tokens (classic)**.
5. No topo, botão **Generate new token** → **Generate new token (classic)**.
6. Em "Note" coloque um nome, ex: `copa-dados`.
7. Em "Expiration" pode deixar 90 dias ou "No expiration".
8. **Marque o quadradinho `repo`** (é o único necessário).
9. Role até o final → botão verde **Generate token**.
10. **COPIE o token AGORA** (começa com `ghp_...`). Só aparece UMA vez. Guarde num bloco de notas.

---

## PASSO 2 — Configurar variáveis na Vercel (5 min)

1. Entre em https://vercel.com/login e faça login (mesma conta do projeto).
2. Clique no projeto **Copa-Vicente**.
3. No menu superior: **Settings** → **Environment Variables**.
4. Adicione UMA A UMA (botão "Add New" → preencha Name e Value → Save):

| Name | Value (o que colocar) |
|------|------------------------|
| `GITHUB_TOKEN` | o token `ghp_...` do Passo 1 |
| `GITHUB_OWNER` | seu nome de usuário do GitHub (ex: `luis-otavio`) |
| `GITHUB_REPO` | o nome EXATO do repositório (ex: `Copa-Vicente`) |
| `GITHUB_BRANCH` | `main` |
| `ADMIN_PASSWORD` | **Use o valor `sis2026`** (tem que ser IGUAL à senha que está no código do site, senão o login passa mas o salvar é recusado) |

6. IMPORTANTE: para cada variável, na janela de criar, marque **todos os ambientes** (Production, Preview e Development) — ou deixe só **Production**.
6. Clique **Save** depois de cada.

> ⚠️ **Atenção à senha:** no código do site, a senha de admin está fixada como `sis2026`. Por isso o `ADMIN_PASSWORD` da Vercel **precisa ser `sis2026` também** (igualzinho). Se você quiser trocar a senha depois, terá que trocar nos DOIS lugares (código + Vercel).

---

## PASSO 3 — Dar o DEPLOY na Vercel (o passo que faltou!)

Isso é o que ativa tudo. Há 2 jeitos:

### Jeito A — Pelo GitHub (o mais simples se o repositório está público)
O `data.json` e a API precisam estar no GitHub para o deploy puxar. Se você já fez push:
1. No GitHub, o push já foi feito. Então basta disparar um novo deploy:
2. No painel Vercel → projeto → aba **Deployments** → botão **Redeploy** (ou "Creat Deployment") no deploy existente.
   - Tipo: **Production**.
3. Espere o build terminar (verde ✓).

### Jeito B — Pelo Terminal (se a CLI)
Instale e execute na pasta do projeto:
```
npm i -g vercel
vercel --prod
```
(Ou, se preferir, faça pelo painel web — Jeito A.)

---

## COMO TESTAR DEPOIS

1. Abra o site publicado (o link .vercel.app).
2. Clique em **Registrar Partida** → digite a senha (`ADMIN_PASSWORD` do Passo 2).
3. Salve um placar.
4. Abra em OUTRO navegador/celular → o placar deve estar lá.

> Dica: se ainda aparecer o placar antigo, force atualização com **Ctrl+F5** (ou limpe o cache), porque o navegador guarda página antiga.

---

## SE AINDA NÃO FUNCIONAR — verifique:

1. **API retornou 404?** → Você não deu deploy (Passo 3). A versão antiga do site ainda está no ar.
2. **API retornou 500 "Configuração GitHub não definida"?** → Faltou alguma variável do Passo 2.
3. **API retornou 401 "Senha incorreta"?** → A senha digitada ≠ `ADMIN_PASSWORD` da Vercel. Lembre que a senha agora é a que você pôs NA VERCEL, não mais no código.

---

## IMPORTANTE (segurança)

- O `ADMIN_PASSWORD` da Vercel **sobrescreve** o `sis2026` do código. Ponha na Vercel a senha que você quer usar.
- O token `ghp_...` NUNCA vai para o código/site — fica só na Vercel.
- **Você já me enviou a senha da SUA CONTA do GitHub em chat aberto. Considere trocar essa senha**, e NUNCA compartilhe senha de conta. Só se usa token.
