import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";

const ALLOWED_PROXY_HOSTS = new Set([
  'disk.yandex.ru',
  'disk.yandex.com',
  'yadi.sk',
]);
const PROXY_TIMEOUT_MS = 30_000;
const PROXY_MAX_BYTES = 50 * 1024 * 1024; // 50 MB

// Приложения Kuzmichev Tools, доступные для скачивания.
// Публичные ссылки Яндекс.Диска хранятся серверно, на клиент не попадают.
const DOWNLOADABLE_APPS: Record<string, { yandexPublicUrl: string }> = {
  "cue-sheets": {
    yandexPublicUrl: "https://disk.yandex.ru/d/CZR2cgCWbmT_6Q",
  },
};

async function resolveYandexDirectUrl(
  publicUrl: string,
  signal: AbortSignal,
): Promise<string> {
  const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicUrl)}`;
  const apiResponse = await fetch(apiUrl, { signal });
  if (!apiResponse.ok) {
    throw new Error(`Yandex API error: ${apiResponse.statusText}`);
  }
  const data = await apiResponse.json();
  if (!data.href) {
    throw new Error("No download URL received from Yandex.Disk");
  }
  // Defense-in-depth: убеждаемся, что прямая ссылка ведёт на хост Яндекса по https.
  const parsed = new URL(data.href as string);
  const host = parsed.hostname.toLowerCase();
  const isYandexHost = host === 'yandex.ru' || host === 'yandex.net' ||
    host.endsWith('.yandex.ru') || host.endsWith('.yandex.net');
  if (parsed.protocol !== 'https:' || !isYandexHost) {
    throw new Error(`Unexpected download host: ${host}`);
  }
  return data.href as string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Proxy route for Yandex.Disk audio files (allowlist + abort + size limit)
  app.get('/api/proxy-audio', async (req, res) => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), PROXY_TIMEOUT_MS);

    // Прерываем upstream-запрос если клиент отключился
    req.on('close', () => {
      if (!res.writableEnded) abortController.abort();
    });

    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // Валидация: разрешаем только https:// + хосты Yandex.Disk
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      if (parsedUrl.protocol !== 'https:' || !ALLOWED_PROXY_HOSTS.has(parsedUrl.hostname)) {
        return res.status(403).json({ error: 'URL host not allowed' });
      }

      // Get the direct download URL from Yandex.Disk API
      const publicKey = encodeURIComponent(url);
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;

      const apiResponse = await fetch(apiUrl, { signal: abortController.signal });
      if (!apiResponse.ok) {
        throw new Error(`Yandex API error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      const downloadUrl = data.href;

      if (!downloadUrl) {
        throw new Error('No download URL received from Yandex.Disk');
      }

      // Fetch the actual audio file
      const audioResponse = await fetch(downloadUrl, { signal: abortController.signal });
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
      }

      // Защита от слишком больших файлов
      const contentLength = audioResponse.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > PROXY_MAX_BYTES) {
        return res.status(413).json({ error: 'Audio file too large' });
      }

      // Set appropriate headers for audio streaming
      res.set({
        'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': contentLength || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      });

      // Stream the audio data with backpressure + size limit + abort handling
      if (audioResponse.body) {
        const reader = audioResponse.body.getReader();
        let bytesStreamed = 0;

        try {
          while (true) {
            if (res.writableEnded || abortController.signal.aborted) break;

            const { done, value } = await reader.read();
            if (done) break;

            bytesStreamed += value.length;
            if (bytesStreamed > PROXY_MAX_BYTES) break;

            const canContinue = res.write(value);
            if (!canContinue) {
              await new Promise<void>(resolve => res.once('drain', () => resolve()));
            }
          }
        } finally {
          reader.cancel().catch(() => {});
        }

        if (!res.writableEnded) res.end();
      } else {
        res.end();
      }

    } catch (error: any) {
      if (abortController.signal.aborted || error?.name === 'AbortError') {
        // Клиент отключился или таймаут — тихо завершаем
        if (!res.writableEnded) res.end();
        return;
      }
      console.error('Proxy audio error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to proxy audio file' });
      } else if (!res.writableEnded) {
        res.end();
      }
    } finally {
      clearTimeout(timeoutId);
    }
  });

  // Скачивание приложений Kuzmichev Tools: увеличиваем счётчик и
  // редиректим на прямую ссылку Яндекс.Диска, чтобы загрузка началась сразу
  // (без открытия страницы Яндекс.Диска и без стриминга большого DMG через сервер).
  app.get('/api/download/:appKey', async (req, res) => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), PROXY_TIMEOUT_MS);
    try {
      const { appKey } = req.params;
      const appConfig = DOWNLOADABLE_APPS[appKey];
      if (!appConfig) {
        return res.status(404).json({ error: 'Unknown app' });
      }

      const directUrl = await resolveYandexDirectUrl(appConfig.yandexPublicUrl, abortController.signal);

      // Считаем скачивание (инициированное). Не блокируем редирект, если счётчик упал.
      try {
        await storage.incrementDownloadCount(appKey);
      } catch (counterError) {
        console.error('Download counter error:', counterError);
      }

      res.redirect(302, directUrl);
    } catch (error: any) {
      if (abortController.signal.aborted || error?.name === 'AbortError') {
        if (!res.writableEnded) res.end();
        return;
      }
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Failed to resolve download link' });
      }
    } finally {
      clearTimeout(timeoutId);
    }
  });

  // Текущее число скачиваний приложения (для скрытой статистики на странице).
  app.get('/api/downloads/:appKey', async (req, res) => {
    try {
      const { appKey } = req.params;
      if (!DOWNLOADABLE_APPS[appKey]) {
        return res.status(404).json({ error: 'Unknown app' });
      }
      const count = await storage.getDownloadCount(appKey);
      res.json({ count });
    } catch (error) {
      console.error('Download count error:', error);
      res.status(500).json({ error: 'Failed to read download count' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
