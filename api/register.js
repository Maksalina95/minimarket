import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    const { name, phone, type } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Телефон обязателен' });
    }

    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Berlin' });
    const entry = type === 'logout' ? `Выход: ${date}` : `${name}: ${date}`;

    const token = process.env.GITHUB_TOKEN;
    const owner = 'Maksalina95';
    const repo = 'proverka';
    const path = 'data.csv';

    const octokit = new Octokit({ auth: token });

    let sha = null;
    let content = '';
    try {
      const response = await octokit.repos.getContent({ owner, repo, path });
      sha = response.data.sha;
      content = Buffer.from(response.data.content, 'base64').toString();
    } catch (error) {
      if (error.status === 404) {
        content = 'Имя,Телефон,История,Заблокирован\n';
      } else {
        throw error;
      }
    }

    const lines = content.trim().split('\n');
    const header = lines[0].trim();
    const dataLines = lines.slice(1);

    let updated = false;
    let isBlocked = false;

    const newDataLines = dataLines.map(line => {
      const columns = [];

      let buffer = '';
      let insideQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          columns.push(buffer);
          buffer = '';
        } else {
          buffer += char;
        }
      }
      columns.push(buffer);

      const [lineName, linePhone, historyRaw = '', blockedRaw = ''] = columns;
      const blocked = blockedRaw.trim();

      if (linePhone === phone) {
        if (blocked === '🔒' || blocked === '✅') {
          isBlocked = true;
          return line;
        }

        const history = historyRaw.replace(/^"|"$/g, ''); // убрать кавычки
        const updatedHistory = `${history}; ${entry}`.replace(/"/g, '""');
        updated = true;

        return `${lineName},${linePhone},"${updatedHistory}",${blocked}`;
      }

      return line;
    });

    if (isBlocked) {
      return res.status(403).json({ error: 'Этот номер заблокирован' });
    }

    if (!updated) {
      const safeEntry = entry.replace(/"/g, '""');
      newDataLines.push(`${name},${phone},"${safeEntry}",`);
    }

    const updatedContent = [header, ...newDataLines].join('\n');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: type === 'logout' ? 'Фиксация выхода' : 'Обновление пользователя',
      content: Buffer.from(updatedContent).toString('base64'),
      sha: sha || undefined,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
