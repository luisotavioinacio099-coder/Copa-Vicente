// Migração: insere o conteúdo atual de data.json na tabela copa_dados do Supabase
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node api/migrar.js
// Para rodar com arquivo .env, instale o dotenv (npm i dotenv) e descomente a linha abaixo.

const fs = require('fs');
const path = require('path');
const https = require('https');

// require('dotenv').config();

function supabaseRequest(method, pathname, body, apikey) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      method,
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=merge-duplicates'
      }
    };
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload);
    const req = https.request(process.env.SUPABASE_URL + pathname, options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        let data = b;
        try { data = JSON.parse(b); } catch (e) {}
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (variáveis de ambiente ou .env).');
    process.exit(1);
  }

  const fileRaw = fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8');
  const dados = JSON.parse(fileRaw);

  const row = { id: 1, dados, atualizado_em: new Date().toISOString() };
  const res = await supabaseRequest('POST', '/rest/v1/copa_dados?on_conflict=id', row, key);

  if (res.status >= 300) {
    console.error('Falha ao salvar:', res.status, JSON.stringify(res.data));
    process.exit(1);
  }

  console.log('Dados migrados com sucesso para o Supabase.');
})();
