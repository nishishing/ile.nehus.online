# microCMS セットアップ手順（運用者向け）

> サイトのコンテンツ（コラム・店舗情報・スタッフ・FAQ など）を、コードを触らず
> **ブラウザの管理画面から更新できるようにする**ための手順です。
> **任意**の作業で、microCMS を入れなくても今のまま（`src/data/*.ts` のコード管理）で
> 公開・運用できます。「自分で記事を足したい／スタッフを差し替えたい」となったら導入してください。
>
> API のフィールド設計（スキーマ）の正は `docs/microcms-schema.md` です。本書はその
> スキーマを microCMS 上に作るところまでの操作ガイドです。

---

## 0. 全体像（5ステップ）

1. microCMS アカウント＋サービスを作る
2. `docs/microcms-schema.md` の通りに API（コンテンツの型）を作る
3. **Read 専用** の API キーを発行する
4. Cloudflare の環境変数に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を登録
5. （エンジニア作業）`src/data/*.ts` の参照を `src/lib/microcms.ts` に切り替える

> 1〜4 は運用者（西村さん）側の作業、5 はコード変更（Claude / エンジニア）です。
> 4 までやってもらえれば、5 はこちらで対応できます。

---

## 1. アカウント＋サービス作成

1. <https://microcms.io/> にアクセスし「無料ではじめる」からアカウント作成（Google ログイン可）。
2. ログイン後「サービスを作成」。
   - **サービス名**: `iLe`（任意）
   - **サービスID**: `ile`（半角英数。これが `MICROCMS_SERVICE_DOMAIN` になります → 例 `ile`）
3. 作成すると管理画面 URL が `https://ile.microcms.io/` のようになります。
   - ⚠️ この `ile` の部分（サービスID）を後で `MICROCMS_SERVICE_DOMAIN` に使います。

> _[スクリーンショット: サービス作成画面]_

---

## 2. API（コンテンツ型）を作成

`docs/microcms-schema.md` に各 API の **エンドポイント名・型（リスト/オブジェクト）・
フィールド** を定義しています。その通りに作成してください。最低限つくるのは以下です。

| API（エンドポイント） | 種類 | 用途 |
|---|---|---|
| `journal` | リスト形式 | コラム・お知らせ・プレスリリース |
| `salons` | リスト形式 | 4 店舗の情報 |
| `stylists` | リスト形式 | スタッフ |
| `faq` | リスト形式 | よくある質問 |
| `glossary` | リスト形式 | 用語集 |

作成手順（各 API 共通）:

1. 管理画面左「API」→「+ 追加」。
2. **API名 / エンドポイント**を上表の通りに（例: `journal`）。
3. **「リスト形式」** を選択（単一ページのみのものは「オブジェクト形式」）。
4. 「APIスキーマ」で、`docs/microcms-schema.md` のフィールド ID・表示名・種類を
   ひとつずつ追加（テキスト / リッチエディタ / 画像 / セレクト / 複数参照 など）。
   - **フィールドID は schema ドキュメントと完全に一致させる**（コード側が ID で読むため）。
5. 保存。

> ⚠️ フィールドIDがズレるとコード側で読めません。`docs/microcms-schema.md` をそのまま写すのが確実です。

> _[スクリーンショット: API スキーマ設定画面]_

---

## 3. API キー（Read 専用）を発行

1. 管理画面「サービス設定」→「APIキー」。
2. デフォルトキーがありますが、**GET（取得）のみ許可**の新規キーを作るのが安全です。
   - 「APIキーを作成」→ 権限で **GET のみ ON**、ほかは OFF。
3. 発行された **API キー文字列**を控える（これが `MICROCMS_API_KEY`）。
   - ⚠️ このキーは秘密情報。チャットやリポジトリに貼らないでください（万一貼ったら再発行）。

> _[スクリーンショット: APIキー作成画面]_

---

## 4. Cloudflare に環境変数を登録

新サイトは Cloudflare Workers（Static Assets）でビルド・配信しています。
ビルド時に microCMS から取得するため、Cloudflare 側に 2 つの環境変数を登録します。

1. Cloudflare ダッシュボード → 対象の Workers プロジェクト（`ile.nehus.online`）。
2. **Settings → Variables and Secrets**（または Build → Environment variables）。
3. 次の 2 つを追加（Production）:
   - `MICROCMS_SERVICE_DOMAIN` = `ile`（手順1のサービスID）
   - `MICROCMS_API_KEY` = （手順3のキー。**Secret/Encrypt** として登録）
4. 保存 → 再デプロイ（`main` への push か、手動 Re-deploy）。

> ⚠️ `MICROCMS_API_KEY` は必ず暗号化（Secret）で登録してください。

---

## 5. コード側の切り替え（エンジニア作業）

現在は `src/data/*.ts`（静的データ）を読んでいます。microCMS を入れたら、
`src/lib/microcms.ts`（環境変数があるときだけ microCMS を叩く実装）に参照を切り替えます。

- `src/lib/content.ts` の各 getter（`getJournalPosts` / `getSalons` / `getStylists` /
  `getFaqItems` / `getGlossaryTerms`）が、環境変数があれば microCMS、無ければ静的データを
  使うよう段階移行します。
- **環境変数が未設定なら従来通り静的データで動く**設計なので、4 まで終わった段階で
  教えてください。こちらで 5 を実装し、preview で確認してから本番反映します。

---

## 動作確認

- microCMS 管理画面で `journal` に記事を 1 件追加 → `main` 再デプロイ →
  `…/journal/` に出れば成功。
- 出ない場合のチェック: サービスID / APIキー / フィールドID の綴り、Cloudflare の
  環境変数（Production スコープ）、再デプロイの有無。

---

## よくあるハマりどころ

- **フィールドIDの不一致**: 表示名は自由だが ID は schema と一致必須。
- **APIキーの権限不足**: GET が許可されていないと取得できない。
- **環境変数の反映**: 登録後に再デプロイしないと効かない。
- **下書き(draft)状態**: microCMS で「公開」しないと本番ビルドに出ない。
