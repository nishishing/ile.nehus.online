# BCC ポータル — 作業ログ（新しい順・上に追記）

> BCC はサロン本体（ing/R）とは別会社。記録はこのファイルと `CLAUDE.md` に閉じる
> （ing の決定ログ・Notion 秘書HQ には書かない — 2026-07-23 受付裁定）。

## 2026-07-23（追記2） — クリーンURL化（受付承認・判断不要枠）

- gen.mjs の内部リンク生成を拡張子なしに変更し全27ページ再生成（189箇所の href 置換のみ）。
- ドメイン・会員ゲート・コンテンツ鮮度は「現状維持」でオーナー決定（受付 2026-07-23）。

## 2026-07-23 — main 移行・公開露出の修正（BCC会員ポータル専任）

- オーナー承認により **PR #53 を main へ squash merge**（merge commit `02c8672`）。
  マージ前 HEAD はタグ `bcc-v1-pre-merge-20260723` で保全。
- マージ前検証: iLe 本サイトへの影響なし（Cloudflare 配信は Astro `dist/` のみ、
  prebuild は `public/` 固定パス、CI にデプロイ工程なし）。PR は conflict なし。
- 全27ページ（内部リンク）と外部リンク36本の生存確認。stores.jp 2本の curl 403 は
  bot 判定（irida は実ブラウザで正常表示を確認）。ページ内リンクが `.html` 付きで
  毎クリック 308 リダイレクトになるのは軽微な改善候補（未実施）。
- **公開露出の発見と修正**: 本番URLで `/CLAUDE.md` と `/_build/gen.mjs` `/_build/writeups.json`
  が配信されていた（Root Directory 直下の静的ファイルは全部配信されるため）。
  `.vercelignore`（CLAUDE.md / SESSIONS.md / _build/）を追加して配信から除外。
- **Vercel Production Branch の main 切替はオーナー操作待ち**
  （このマシンに Vercel 認証がなく、ダッシュボード操作が必要。手順は受付へ共有済み）。
  切替確認まで旧デプロイブランチ `claude/vigilant-dirac-cduzkl` は削除しない。
- 担当整理: BCC の Web 資産はこのセッション（BCC会員ポータル専任）に一本化。
  ストア認証情報ローテーションはオンラインサロン（ing側）案件のため担当外（受付が引き取り）。
