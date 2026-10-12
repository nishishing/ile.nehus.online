#!/usr/bin/env node
/**
 * IndexNow — 公開した URL を Bing などの検索エンジンへ知らせる（2026-10-12 オーナー承認）。
 *
 * なぜ: AI 検索（Claude・ChatGPT 等）が使う検索エンジンに公式サイトが載っておらず、
 *   site:ile-hair-harajuku.com が0件・AI の回答の出典にも一度も出ていなかった（2026-10-12 実測）。
 *   IndexNow は Bing / Yandex / Seznam / Naver などが共同で受け付ける「更新しました」の通知口。
 *
 * 使い方:
 *   node scripts/indexnow.mjs --all          … 本番の sitemap に載っている全 URL を通知
 *   node scripts/indexnow.mjs <url> [<url>…] … 指定した URL だけ通知（自動ブログの公開後に使う）
 *
 * 鍵: public/eb69cd0a840219e809a51fbd6d068cf6.txt（中身は鍵そのもの）。公開の鍵なので秘密情報ではない。
 * 失敗しても公開そのものは止めない（終了コード 0。結果は標準出力に出す）。
 */
const HOST = "ile-hair-harajuku.com";
const KEY = "eb69cd0a840219e809a51fbd6d068cf6";
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function sitemapUrls() {
  const index = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.includes("--all")
  ? await sitemapUrls()
  : args.filter((a) => a.startsWith(`https://${HOST}/`) || a === `https://${HOST}`);

if (urlList.length === 0) {
  console.log("[indexnow] 通知する URL がありません");
  process.exit(0);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urlList.slice(0, 10000),
    }),
  });
  // 200/202 = 受理。403 = 鍵ファイルが見えない。422 = URL がホストと合わない。429 = 送りすぎ
  console.log(`[indexnow] ${urlList.length} 件を通知 → HTTP ${res.status}`);
} catch (e) {
  console.log(`[indexnow] 通知に失敗（公開は続行）: ${e}`);
}
