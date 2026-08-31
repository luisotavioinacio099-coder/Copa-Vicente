// API da Vercel: Salva o data.json no repositório GitHub (faz commit)
// Armazenado em: api/salvar.js
// Endpoint: /api/salvar  (POST com {"data": {...}})

const https = require('https');

function ghRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        let data = b;
        try { data = JSON.parse(b); } catch (e) {}
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = 'data.json';

  const adminPassword = process.env.ADMIN_PASSWORD || 'sis2026';
  const sentPassword = req.body && req.body._password;
  if (sentPassword !== adminPassword) {
    return res.status(401).json({ error: 'Senha de administrador incorreta.' });
  }

  if (!token || !owner || !repo) {
    return res.status(500).json({ error: 'Configuração GitHub não definida nas variáveis de ambiente.' });
  }

  try {
    const content = req.body && req.body.data ? JSON.stringify(req.body.data) : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));
    const base64 = Buffer.from(content, 'utf8').toString('base64');

    // Busca o SHA atual do arquivo (necessário para o GitHub fazer update)
    const getRes = await ghRequest({
      host: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      method: 'GET',
      headers: {
        'User-Agent': 'copa-vicente',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    let sha = null;
    if (getRes.status === 200 && getRes.data.sha) sha = getRes.data.sha;

    const putBody = JSON.stringify({
      message: 'Atualização Copa Vicente',
      content: base64,
      branch,
      sha: sha || undefined
    });

    const putRes = await ghRequest({
      host: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      method: 'PUT',
      headers: {
        'User-Agent': 'copa-vicente',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(putBody)
      }
    }, putBody);

    if (putRes.status >= 300) {
      return res.status(putRes.status).json({ error: 'Falha ao salvar no GitHub', detail: putRes.data });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
