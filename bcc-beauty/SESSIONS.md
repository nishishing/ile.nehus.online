# BCC ポータル — 作業ログ（新しい順・上に追記）

## 2026-07-24 — StyleManager 告知の BCC 会員配信（準備・オーナー承認待ち）

- HPB担当リレー（オーナー指示）。会員へ「おすすめコンテンツ」として一斉配信＋ノート掲載したい。
- **受付は「告知URLが Tailscale 専用で外部不可」と警告 → 実地検証で覆した**: このホストは Funnel 有効で、
  公開DNS(8.8.8.8→103.84.155.153)経由で /announce に 200・実コンテンツ到達を確認。外部会員は開ける。
  （最初の私の curl は自分が tailnet 上のため tailnet 経由で不十分な証拠だった＝MagicDNS で 100.74.243.2 に解決）。
- ただし自宅サーバ＋Funnel 依存は 755 名配信リンクとして脆弱 → 可用性・ブランドのため BCC にミラー（受付推奨(a)）。
  ページは自己完結（外部参照は CTA の公式LINE のみ・チャートはインライン base64）→ `stylemanager.html` に verbatim コピー。
- **未公開**: 顧客向け公開のため draft PR で保留。配信文面（A短文/Bノート版）もオーナー承認待ち。
  配信自体はオーナーが BCC 公式LINE 等で実行（私は代理送信不可）。文面は scratchpad/bcc-stylemanager-broadcast-2026-07-24.md。

> BCC はサロン本体（ing/R）とは別会社。記録はこのファイルと `CLAUDE.md` に閉じる
> （ing の決定ログ・Notion 秘書HQ には書かない — 2026-07-23 受付裁定）。

## 2026-07-23（追記5） — 会員限定ページに noindex（受付判断GO）

- pageDoc() に robots meta を追加し再生成。index＋詳細25=noindex / about・404=なし をローカル検証後デプロイ。

## 2026-07-23（追記4） — 移行完了

- main push → 本番デプロイをマーカーで実証（配信確認済み → 本コミットで撤去）。
- 切替後の全ページ確認: 27ページ 200 / 内部ファイル4点 404 / 旧 `.html` リンク残 0。
- **旧デプロイブランチ `claude/vigilant-dirac-cduzkl` を削除**（バックアップはタグ
  `bcc-v1-pre-merge-20260723` で保持）。以後の本番反映は「draft PR → ready → squash merge → main」のみ。

## 2026-07-23（追記3） — Vercel main 切替後の検証

- オーナーが Vercel Branch Tracking を main に切替。受付の削除前照合で「41ファイル差分」報告
  → 精査の結果、**ブランチ先端同士の bcc-beauty/ は完全一致（content diff ゼロ）**。
  見かけの差分は squash マージ後の三点比較（merge-base 比較）による履歴上のもので、
  旧ブランチにしか無い変更は無し。**照合は今後も二点比較（tip vs tip の content diff）で行うこと。**
- main からの本番デプロイ実証のため検証マーカー `deploy-check-main.txt` を一時設置
  （配信確認後に削除。非公開URLのみ・公開ページへの影響なし）。

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
