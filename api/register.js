// api/register.js

import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Berlin' });
    const newLine = `${name},${phone},${date}\n`;

    const token = process.env.GITHUB_TOKEN;
    const owner = 'Maksalina95'; // 👈 Твой GitHub username
    const repo = 'proverka';     // 👈 Название репозитория
    const path = 'data.csv';     // 👈 Путь к файлу в репозитории

    const octokit = new Octokit({ auth: token });

    // Получаем текущий файл
    let sha = null;
    let content = '';

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      sha = response.data.sha;
      content = Buffer.from(response.data.content, 'base64').toString();
    } catch (error) {
      if (error.status === 404) {
        // Файл ещё не существует — ничего страшного
        sha = null;
        content = '';
      } else {
        throw error;
      }
    }

    // Добавляем новую строку
    const updatedContent = content + newLine;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'Добавлен новый пользователь',
      content: Buffer.from(updatedContent).toString('base64'),
      sha: sha || undefined,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
