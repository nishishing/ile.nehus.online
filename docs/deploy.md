# Deploy — Cloudflare Pages

## 構成概要

- **ホスティング**: Cloudflare Pages（静的ホスティング + Edge）
- **ビルド**: GitHub 連携で push → 自動ビルド → 自動デプロイ
- **プレビュー**: PR ごとに自動でプレビュー URL が発行される
- **ドメイン**: `ile-hair-harajuku.com`

## 初回セットアップ手順

### 1. Cloudflare アカウントの準備
1. <https://dash.cloudflare.com> でアカウント作成（無料）
2. 左メニュー **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

### 2. GitHub リポジトリと接続
1. GitHub アカウントを接続
2. リポジトリ `nishishing/ile.nehus.online` を選択
3. プロジェクト名: `ile`（任意）
4. プロダクションブランチ: `main`

### 3. ビルド設定

| 項目 | 値 |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22` |

### 4. 環境変数

**Production** に以下を登録：

| Key | Value | 備考 |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://ile-hair-harajuku.com` | 本番URL |
| `MICROCMS_SERVICE_DOMAIN` | （microCMS設定後に追加） | |
| `MICROCMS_API_KEY` | （microCMS設定後に追加） | Secret として登録 |

### 5. カスタムドメインの設定
1. **Custom domains** → **Set up a custom domain**
2. `ile-hair-harajuku.com` を入力
3. ConoHa の DNS 設定で Cloudflare の指示通りに CNAME / A レコードを設定
4. SSL 証明書の発行を待つ（自動）

### 6. 既存 WordPress からの切替（公開日）
1. ConoHa で `ile-hair-harajuku.com` の DNS を Cloudflare のネームサーバーへ切替、または直接 CNAME を Pages の URL に変更
2. WordPress 側の wp-config はバックアップしてからサーバー上で物理停止（または別ディレクトリへ退避）
3. Cloudflare Pages 側で本番ドメインが Active になったことを確認
4. Search Console で sitemap (`/sitemap-index.xml`) を送信

## デプロイの流れ（日常運用）

```
コード変更 → git push → Cloudflare Pages が自動でビルド → 本番反映
```

PR を作ると自動でプレビュー URL が発行されるので、デザインや内容を確認してからマージしてください。

## ロールバック

Cloudflare Pages の **Deployments** タブから過去のビルドにワンクリックで戻せます。
