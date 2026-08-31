// API da Vercel: Lê o data.json do repositório GitHub
// Armazenado em: api/ler.js
// Endpoint: /api/ler

const https = require('https');

function ghRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
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
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const path = 'data.json';

    if (!token || !owner || !repo) {
      return res.status(500).json({ error: 'Configuração GitHub não definida nas variáveis de ambiente.' });
    }

    const result = await ghRequest({
      host: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      method: 'GET',
      headers: {
        'User-Agent': 'copa-vicente',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (result.status === 404) {
      // arquivo não existe ainda, retorna objeto neutro
      return res.status(200).json(null);
    }
    if (result.status !== 200) {
      return res.status(result.status).json({ error: 'Falha ao ler do GitHub', detail: result.data });
    }

    const content = Buffer.from(result.data.content, 'base64').toString('utf8');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(content);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
