// API da Vercel: Lê os dados salvos no Supabase (Postgres via PostgREST)
// Armazenado em: api/ler.js
// Endpoint: /api/ler

const https = require('https');

function supabaseRequest(method, path, apikey) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
        'Accept': 'application/json'
      }
    };
    const req = https.request(process.env.SUPABASE_URL + path, options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        let data = body;
        try { data = JSON.parse(body); } catch (e) {}
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  // CORS para o site (permite o navegador chamar a API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return res.status(500).json({ error: 'Configuração Supabase não definida nas variáveis de ambiente.' });
    }

    const result = await supabaseRequest('GET', '/rest/v1/copa_dados?select=dados&id=eq.1', key);

    if (result.status !== 200) {
      return res.status(result.status).json({ error: 'Falha ao ler do Supabase', detail: result.data });
    }

    const rows = result.data || [];
    if (!rows.length || rows[0].dados === null || rows[0].dados === undefined) {
      return res.status(200).json(null);
    }

    return res.status(200).json(rows[0].dados);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
