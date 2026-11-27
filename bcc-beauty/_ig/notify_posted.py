#!/usr/bin/env python3
"""BCC のインスタ・Threads が出たら、その日の分を「まとめて1通」オーナーの LINE へ知らせる。

依頼: オーナー 2026-11-27「これ投稿したら、僕の方で再投稿、本垢の方でやったりしたいと思ってるので、
      投稿したら通知欲しいかもです！一件ずつじゃなくて、まとめて！」

- launchd（com.nishishing.bcc-post-notify）が 20:15・20:45・21:30 に動かす。
- その日（JST）に予定されていた BCC の投稿がすべて出終わったら（または最後の 21:30 になったら）1通だけ送る。
- 同じ日に2回は送らない（~/.local/state/bcc-post-notify/<日付>.sent）。
- その日に BCC の予定が無ければ何もしない。
- その日のオープンチャット用の素材（openchat/<日付>.json の text と image）があれば、同じ1回の送信に
  「文」と「画像」を続けて入れる（オーナーがそのままコピー・保存してオープンチャットに貼る）。
  画像は公開サイトの /oc/<日付>.jpg（一覧からはリンクしていない）。依頼: オーナー 2026-11-27「それでお願いしたいですね！」

手で試す:  python3 notify_posted.py --date 2026-11-23 --dry   （送らずに本文だけ表示）
"""
import datetime as dt, json, os, subprocess, sys

API = "https://post-mesh.com/api/v1"
KEY = os.path.expanduser("~/.config/post-mesh/api_key")
CONNS = {"cmwqm6ivf00yt01s6cmldbm46": "インスタ", "cmwrosz0200fh01s6j1k6bllc": "Threads"}
STATE = os.path.expanduser("~/.local/state/bcc-post-notify")
LAST_RUN = (21, 30)  # これ以降は出終わっていなくても送る（失敗・遅れを知らせる）
JST = dt.timezone(dt.timedelta(hours=9))
KIND = {"image": "カルーセル", "video": "リール"}


def get(path):
    # 鍵はコマンドラインに出さない（標準入力からヘッダーとして渡す）
    hdr = "Authorization: Bearer " + open(KEY).read().strip() + "\n"
    r = subprocess.run(["curl", "-sS", "-H", "@-", API + path], input=hdr, capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def main():
    args = sys.argv[1:]
    dry = "--dry" in args
    now = dt.datetime.now(JST)
    day = dt.date.fromisoformat(args[args.index("--date") + 1]) if "--date" in args else now.date()
    sent = os.path.join(STATE, f"{day}.sent")
    if os.path.exists(sent) and not dry:
        return

    rows = []
    for st in ("posted", "scheduled", "failed"):
        for page in (1, 2):
            for p in get(f"/posts?status={st}&limit=100&page={page}").get("data", []):
                at = dt.datetime.fromisoformat(p["display_at"].replace("Z", "+00:00")).astimezone(JST)
                if at.date() != day or not {"instagram", "threads"} & {t.get("platform") for t in p.get("platforms", [])}:
                    continue
                # 一覧には連携先と URL が無いので1件ずつ引く（同じポストメッシュに他の担当の投稿もある）
                full = get(f"/posts/{p['id']}").get("data", {})
                for t in full.get("platforms", []):
                    if t.get("connection_id") in CONNS:
                        rows.append((at, CONNS[t["connection_id"]], KIND.get(full.get("category"), full.get("category")),
                                     t.get("status"), t.get("external_url"), t.get("error_message")))
    rows = sorted(set(rows))
    if not rows:
        return
    waiting = [r for r in rows if r[3] == "scheduled"]
    if waiting and (now.hour, now.minute) < LAST_RUN and not dry:
        return  # まだ出ていない分がある。次の回で
    lines = [f"📣 BCC 本日の投稿（{day.month}/{day.day}）"]
    for at, plat, kind, status, url, err in rows:
        head = f"・{at:%H:%M} {plat} {kind}"
        if status == "posted" and url:
            lines += [head, url]
        elif status == "scheduled":
            lines.append(head + "　⚠️ まだ出ていません")
        else:
            lines.append(head + f"　⚠️ 失敗（{err or status}）")
    oc = os.path.join(os.path.dirname(os.path.abspath(__file__)), "openchat", f"{day}.json")
    msgs = None
    if os.path.exists(oc):
        o = json.load(open(oc, encoding="utf-8"))
        lines += ["", "👇 オープンチャット用（文と画像）"]
        msgs = [{"type": "text", "text": "\n".join(lines)}, {"type": "text", "text": o["text"]}]
        if o.get("image"):
            msgs.append({"type": "image", "originalContentUrl": o["image"], "previewImageUrl": o["image"]})
    text = "\n".join(lines)
    if dry:
        print(json.dumps(msgs, ensure_ascii=False, indent=1) if msgs else text)
        return
    sys.path.insert(0, os.path.expanduser("~/claude-config-runner"))
    from lib.line_notify import notify
    if (notify(messages=msgs) if msgs else notify(text)):
        os.makedirs(STATE, exist_ok=True)
        open(sent, "w").write(now.isoformat())


if __name__ == "__main__":
    main()
