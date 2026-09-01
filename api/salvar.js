// API da Vercel: Salva os dados no Supabase (Postgres via PostgREST)
// Armazenado em: api/salvar.js
// Endpoint: /api/salvar  (POST com {"data": {...}})

const https = require('https');

function supabaseRequest(method, path, body, apikey) {
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
    const req = https.request(process.env.SUPABASE_URL + path, options, (res) => {
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const adminPassword = process.env.ADMIN_PASSWORD || 'sis2026';
  const sentPassword = req.body && req.body._password;
  if (sentPassword !== adminPassword) {
    return res.status(401).json({ error: 'Senha de administrador incorreta.' });
  }

  if (!url || !key) {
    return res.status(500).json({ error: 'Configuração Supabase não definida nas variáveis de ambiente.' });
  }

  try {
    const content = (req.body && req.body.data) ? req.body.data : (typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}));
    const row = { id: 1, dados: content, atualizado_em: new Date().toISOString() };

    const result = await supabaseRequest('POST', '/rest/v1/copa_dados?on_conflict=id', row, key);

    if (result.status >= 300) {
      return res.status(result.status).json({ error: 'Falha ao salvar no Supabase', detail: result.data });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
