# 本番公開（DNS切替）＋ Search Console 手順（運用者向け）

> 本番ドメイン **`ile-hair-harajuku.com`** を、現在の旧サイト（ConoHa WING の
> WordPress）から、**新サイト（Cloudflare Workers）** に切り替えるための手順です。
> リブランド 2026-08-01 に合わせ、**7/27 頃のソフト公開**を想定しています。
>
> 現在の新サイト（ステージング）: <https://ile.boku-244.workers.dev>

---

## 0. 全体像

1. ステージングで最終確認
2. Cloudflare に本番ドメインを追加（Workers のカスタムドメイン）
3. DNS を Cloudflare に向ける（ネームサーバー変更 or レコード設定）
4. SSL（https）が有効化されるのを確認
5. 旧 WordPress を退避（リダイレクト or 停止）
6. Google Search Console 登録 ＋ sitemap 送信
7. 公開後チェック

> ⚠️ DNS 切替は反映に時間がかかる（数十分〜最大48時間）ため、**深夜〜早朝など
> アクセスの少ない時間帯**に実施し、当日は予約導線（Hot Pepper）に影響が出ていないか確認を。

---

## 1. ステージングで最終確認

切替前に <https://ile.boku-244.workers.dev> で最終チェック:

- [ ] トップ / 各店舗 / スタイリスト / Effect Bleach / FAQ / Journal が正しく表示
- [ ] スマホ表示崩れなし
- [ ] 予約リンク（各店 Hot Pepper）が正しい URL に飛ぶ
- [ ] 誤字・古い情報がない

---

## 2. Cloudflare に本番ドメインを追加

新サイトは **Workers（Static Assets）** で配信しています。

1. Cloudflare ダッシュボード → 対象の Workers プロジェクト（`ile.nehus.online` を配信している Worker）。
2. **Settings → Domains & Routes → Add → Custom Domain**。
3. `ile-hair-harajuku.com` と `www.ile-hair-harajuku.com` を追加。
4. Cloudflare が自動で必要な DNS レコード・証明書を用意します。

> _[スクリーンショット: Workers の Custom Domain 追加画面]_

> 補足: カスタムドメインを使うには、そのドメインが **Cloudflare 上のゾーンとして
> 管理されている**必要があります（＝手順3でネームサーバーを Cloudflare に向ける）。

---

## 3. DNS を Cloudflare に向ける

ドメインの管理元（ConoHa / お名前.com など、`ile-hair-harajuku.com` を取得した所）で
ネームサーバーを Cloudflare のものに変更します。

1. Cloudflare ダッシュボード → **Add a site** → `ile-hair-harajuku.com` を追加（Free プランでOK）。
2. Cloudflare が既存 DNS レコードを読み込む → 指定された **2つのネームサーバー**
   （例: `xxx.ns.cloudflare.com`）が表示される。
3. ドメイン管理元の管理画面で、**ネームサーバーを上記 Cloudflare のものに変更**。
4. 反映後（数十分〜数時間）、Cloudflare 側でドメインが「Active」になる。
5. 手順2のカスタムドメインが有効化される。

> ⚠️ **メール（独自ドメインのメール）を使っている場合**は、MX レコードなど既存の
> 重要レコードが Cloudflare に引き継がれているか必ず確認（消えるとメールが止まります）。

---

## 4. SSL / https の確認

- Cloudflare の **SSL/TLS → 概要**を「Full」もしくは「Full (Strict)」に。
- `https://ile-hair-harajuku.com` で鍵マークが付く（証明書発行に数分〜）。
- `http://` → `https://`、`www` 有無の統一（Cloudflare の Redirect Rules で
  `www` → apex など片方に寄せると重複コンテンツを防げる）。

---

## 5. 旧 WordPress（ConoHa WING）の退避

- 新サイトが本番ドメインで正しく出ることを確認してから、旧サイトを**停止 or 非公開**に。
- 旧 URL に被リンク/インデックスがある場合、主要ページは新サイトの該当ページへ
  **301 リダイレクト**できると SEO 評価を引き継げる（Cloudflare の Redirect Rules / Bulk Redirects）。
- すぐに消さず、しばらく並行 → 問題なければ解約、が安全。

---

## 6. Google Search Console 登録 ＋ sitemap 送信

公開直後にやると、検索エンジンへのインデックスが早まります。

1. <https://search.google.com/search-console> にアクセス。
2. プロパティ追加 → **ドメイン**（`ile-hair-harajuku.com`）。
3. 表示された **TXT レコード**を Cloudflare の DNS に追加して所有権確認。
4. 確認できたら、左メニュー **サイトマップ** → 次を送信:
   - `https://ile-hair-harajuku.com/sitemap-index.xml`
   - （サイトは `@astrojs/sitemap` で自動生成。404/manifest/security.txt は除外済み）
5. 主要ページを **URL 検査 → インデックス登録をリクエスト**（トップ / Effect Bleach / 各店舗）。
6. （任意）Bing Webmaster Tools も同様に登録。

> _[スクリーンショット: Search Console サイトマップ送信画面]_

---

## 7. 公開後チェックリスト

- [ ] `https://ile-hair-harajuku.com/` が新サイトで表示される
- [ ] `www` ありでも正しく表示 or 片方にリダイレクト
- [ ] 主要ページ（店舗 / Effect Bleach / FAQ / Journal）が 200 で開く
- [ ] スマホ表示OK・予約リンクOK
- [ ] `…/sitemap-index.xml` が開ける
- [ ] Search Console でサイトマップ「成功」
- [ ] 旧 WordPress の主要 URL がリダイレクト or 停止
- [ ] （独自メール利用時）メール送受信に影響なし

---

## ロールバック（切り戻し）

万一新サイトに問題が出た場合:

- ドメインのネームサーバーを**元（ConoHa 等）に戻す**、または Cloudflare DNS で
  旧サーバーの A/CNAME レコードに戻すと、旧 WordPress に復帰できます（反映に時間差あり）。
- そのため、**切替後しばらくは旧サイトを消さない**こと。

---

## 関連

- microCMS 導入は `docs/microcms-setup.md`。
- 旧 Cloudflare Pages 時代のメモは `docs/deploy.md`（現在は Workers Static Assets 運用）。
