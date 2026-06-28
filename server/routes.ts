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
// yandexPublicUrl — ссылка на ПАПКУ: владелец кладёт туда новую версию .dmg,
// сервер сам находит самый свежий файл и отдаёт его под настоящим именем.
// fallbackFileName используется только если у файла почему-то нет имени.
const DOWNLOADABLE_APPS: Record<string, { yandexPublicUrl: string; fallbackFileName: string }> = {
  "cue-sheets": {
    yandexPublicUrl: "https://disk.yandex.ru/d/XZrXGQw8ywdgmQ",
    fallbackFileName: "CueSheets.dmg",
  },
  "kt-leveler": {
    yandexPublicUrl: "https://disk.yandex.ru/d/ma8AjHl2OrnQtw",
    fallbackFileName: "KTLeveler.dmg",
  },
};

// DMG невелик (~3.8 МБ), но оставляем щедрый лимит на будущие версии.
const DOWNLOAD_MAX_BYTES = 200 * 1024 * 1024; // 200 MB

// Defense-in-depth: прямая ссылка должна вести на хост Яндекса по https.
function assertYandexHttpsUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase();
  const isYandexHost = host === 'yandex.ru' || host === 'yandex.net' ||
    host.endsWith('.yandex.ru') || host.endsWith('.yandex.net');
  if (parsed.protocol !== 'https:' || !isYandexHost) {
    throw new Error(`Unexpected download host: ${host}`);
  }
  return rawUrl;
}

// Достаёт версию вида 1.0.1 из имени файла; нет версии — null.
function parseVersion(name: string): number[] | null {
  const m = name.match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)];
}

// Сравнение версий по убыванию (свежее — раньше).
function compareVersionDesc(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    const diff = (b[i] ?? 0) - (a[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

interface YandexItem {
  type: string;
  name: string;
  modified?: string;
  file?: string;
}

// Ссылка ведёт на ПАПКУ: читаем её содержимое, выбираем самый свежий .dmg
// (по номеру версии в имени, при равенстве — по дате изменения) и возвращаем
// прямой URL + настоящее имя файла. Если ссылка ведёт прямо на файл — отдаём его.
async function resolveLatestDmg(
  publicUrl: string,
  signal: AbortSignal,
): Promise<{ href: string; fileName: string }> {
  const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}&limit=200`;
  const apiResponse = await fetch(listUrl, { signal });
  if (!apiResponse.ok) {
    throw new Error(`Yandex API error: ${apiResponse.statusText}`);
  }
  const data = await apiResponse.json();

  // Случай, когда ссылка указывает прямо на один файл, а не на папку.
  if (data.type === 'file') {
    if (!data.file) {
      throw new Error('No download URL received from Yandex.Disk');
    }
    return { href: assertYandexHttpsUrl(data.file as string), fileName: data.name };
  }

  const items: YandexItem[] = data?._embedded?.items ?? [];
  const dmgs = items.filter(
    (it) => it.type === 'file' && it.name.toLowerCase().endsWith('.dmg') && !!it.file,
  );
  if (dmgs.length === 0) {
    throw new Error('No .dmg file found in Yandex.Disk folder');
  }

  dmgs.sort((a, b) => {
    const va = parseVersion(a.name);
    const vb = parseVersion(b.name);
    if (va && vb) {
      const byVer = compareVersionDesc(va, vb);
      if (byVer !== 0) return byVer;
    } else if (va) {
      return -1;
    } else if (vb) {
      return 1;
    }
    // Запасной критерий — дата изменения (свежее раньше).
    return new Date(b.modified ?? 0).getTime() - new Date(a.modified ?? 0).getTime();
  });

  const latest = dmgs[0];
  return { href: assertYandexHttpsUrl(latest.file as string), fileName: latest.name };
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

  // Скачивание приложений Kuzmichev Tools: отдаём файл потоком через свой сервер
  // с принудительным корректным именем. Прямой 302 на Яндекс.Диск ненадёжен —
  // цепочка кросс-доменных редиректов (downloader → storage) теряет имя файла,
  // и браузер сохраняет крошечную заглушку с именем-токеном вместо DMG.
  // Файл НЕ хранится на сервере — лишь транзитом передаётся с Яндекс.Диска.
  app.get('/api/download/:appKey', async (req, res) => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), PROXY_TIMEOUT_MS);

    // Прерываем upstream-запрос если клиент отключился.
    req.on('close', () => {
      if (!res.writableEnded) abortController.abort();
    });

    try {
      const { appKey } = req.params;
      const appConfig = DOWNLOADABLE_APPS[appKey];
      if (!appConfig) {
        return res.status(404).json({ error: 'Unknown app' });
      }

      const { href: directUrl, fileName } = await resolveLatestDmg(appConfig.yandexPublicUrl, abortController.signal);

      // Скачиваем сам файл с Яндекс.Диска (fetch сам проходит цепочку редиректов).
      const fileResponse = await fetch(directUrl, { signal: abortController.signal });
      if (!fileResponse.ok || !fileResponse.body) {
        throw new Error(`Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`);
      }

      const contentLength = fileResponse.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > DOWNLOAD_MAX_BYTES) {
        return res.status(413).json({ error: 'File too large' });
      }

      // Принудительно задаём имя файла и тип — браузер сохранит DMG корректно.
      // Имя берём настоящее (из папки), запасное — только если оно пустое.
      const safeFileName = (fileName || appConfig.fallbackFileName).replace(/[^A-Za-z0-9._-]/g, '_');
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Cache-Control': 'no-store',
      });

      // Считаем скачивание (инициированное). Не блокируем загрузку, если счётчик упал.
      try {
        await storage.incrementDownloadCount(appKey);
      } catch (counterError) {
        console.error('Download counter error:', counterError);
      }

      // Стримим тело с backpressure + контролем размера + обработкой abort.
      const reader = fileResponse.body.getReader();
      let bytesStreamed = 0;
      try {
        while (true) {
          if (res.writableEnded || abortController.signal.aborted) break;

          const { done, value } = await reader.read();
          if (done) break;

          bytesStreamed += value.length;
          if (bytesStreamed > DOWNLOAD_MAX_BYTES) break;

          const canContinue = res.write(value);
          if (!canContinue) {
            await new Promise<void>(resolve => res.once('drain', () => resolve()));
          }
        }
      } finally {
        reader.cancel().catch(() => {});
      }

      if (!res.writableEnded) res.end();
    } catch (error: any) {
      if (abortController.signal.aborted || error?.name === 'AbortError') {
        if (!res.writableEnded) res.end();
        return;
      }
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Failed to download file' });
      } else if (!res.writableEnded) {
        res.end();
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
