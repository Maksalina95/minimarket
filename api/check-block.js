import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Телефон обязателен' });
  }

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const { data } = await octokit.repos.getContent({
      owner: 'Maksalina95',
      repo: 'proverka',
      path: 'data.csv',
    });

    const content = Buffer.from(data.content, 'base64').toString();
    const lines = content.trim().split('\n').slice(1); // Пропускаем заголовок

    const isBlocked = lines.some(line => {
      const parts = line.split(',');
      const linePhone = parts[1]?.trim();
      const blocked = parts[3]?.trim();
      return linePhone === phone && (blocked === '🔒' || blocked === '✅');
    });

    res.status(200).json({ blocked: isBlocked });
  } catch (error) {
    console.error("Ошибка при проверке блокировки:", error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
