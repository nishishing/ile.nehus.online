import { site } from "~data/site";

/**
 * ブランド統一（`site.unifiedAt` = 2026-08-01 JST）が発効済みかを
 * **ビルド時点**で判定する。SSG のため値はビルド時に固定される。
 *
 * 8/1 以降に走るビルド（auto-blog は平日 JST 9:00 頃）で、サイト全体の
 * 予告表現（「統一します」/告知バー）が完了表現へ自動的に切り替わる。
 * ⚠️ 当日 0:00〜朝のビルドまでは予告のまま。即時反映したい場合は 8/1 に手動再デプロイ。
 */
export const isUnified =
  new Date() >= new Date(`${site.unifiedAt}T00:00:00+09:00`);

/** 統一前は `future`、統一後は `past` を返す（時制の出し分け）。 */
export function unifyTense(future: string, past: string): string {
  return isUnified ? past : future;
}
