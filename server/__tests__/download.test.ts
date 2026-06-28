import { test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import express from "express";
import { registerRoutes } from "../routes";

// Интеграционный тест эндпоинта скачивания DMG.
//
// Зачем: скачивание уже ломалось — вместо файла сохранялась крошечная заглушка
// (~15 КБ). Сейчас сервер стримит DMG потоком. Этот тест ловит повторную поломку:
// если эндпоинт снова начнёт отдавать заглушку или потеряет имя файла, тест упадёт.
//
// Устойчивость к сетевым флапам Яндекс.Диска: файл идёт транзитом с внешнего хоста,
// поэтому если апстрим недоступен (502 от нашего сервера, таймаут или сетевая
// ошибка fetch) — тест помечается как пропущенный, а не падает.

const REQUEST_TIMEOUT_MS = 45_000;
const MIN_EXPECTED_BYTES = 1024 * 1024; // > 1 МБ — заведомо больше любой заглушки
const EXPECTED_FILENAME = "CueSheets-1.0.0.dmg";

function isNetworkError(err: unknown): boolean {
  const name = (err as { name?: string })?.name;
  if (name === "AbortError" || name === "TimeoutError") return true;
  const code = (err as { cause?: { code?: string } })?.cause?.code;
  if (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    code === "UND_ERR_CONNECT_TIMEOUT"
  ) {
    return true;
  }
  return false;
}

test(
  "GET /api/download/cue-sheets streams the real DMG (not a stub)",
  { timeout: REQUEST_TIMEOUT_MS + 15_000 },
  async (t) => {
    const app = express();
    const server = await registerRoutes(app);

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      let response: Response;
      try {
        response = await fetch(
          `http://127.0.0.1:${port}/api/download/cue-sheets`,
          { signal: controller.signal },
        );
      } catch (err) {
        if (isNetworkError(err)) {
          t.skip(`Yandex.Disk unreachable (network flap): ${String(err)}`);
          return;
        }
        throw err;
      }

      // 502 = наш сервер не смог достучаться до Яндекс.Диска (сетевой флап апстрима).
      if (response.status === 502) {
        await response.body?.cancel();
        t.skip("Upstream Yandex.Disk returned an error (502) — treated as network flap");
        return;
      }

      assert.equal(response.status, 200, "download endpoint must return 200");

      const disposition = response.headers.get("content-disposition") ?? "";
      assert.ok(
        disposition.includes(EXPECTED_FILENAME),
        `Content-Disposition must contain "${EXPECTED_FILENAME}", got: "${disposition}"`,
      );

      let bytes: ArrayBuffer;
      try {
        bytes = await response.arrayBuffer();
      } catch (err) {
        if (isNetworkError(err)) {
          t.skip(`Stream interrupted mid-download (network flap): ${String(err)}`);
          return;
        }
        throw err;
      }

      assert.ok(
        bytes.byteLength > MIN_EXPECTED_BYTES,
        `Downloaded file must be larger than ${MIN_EXPECTED_BYTES} bytes ` +
          `(a stub would be tiny), got ${bytes.byteLength} bytes`,
      );
    } finally {
      clearTimeout(timeout);
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
);

test("GET /api/download/:appKey returns 404 for an unknown app", async () => {
  const app = express();
  const server = await registerRoutes(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(
      `http://127.0.0.1:${port}/api/download/does-not-exist`,
    );
    assert.equal(response.status, 404);
    await response.body?.cancel();
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
