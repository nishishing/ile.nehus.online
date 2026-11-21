# 下書き（drafts/<sid>.json）と out/ の画像・動画を、ポストメッシュ経由で BCC のインスタへ予約する（2026-11-22 BCC担当）
# 使い方:
#   python3 post.py bcc-about carousel 2026-11-23 20:00 --schedule   … out/bcc-about-1..N.png をカルーセルで予約
#   python3 post.py bcc-about reel     2026-11-27 20:00 --schedule   … out/bcc-about-reel.mp4 をリールで予約
#   --draft にすると下書き（SNS へは出ない・API から公開に昇格できないので試し用）
# 🔴 予約（--schedule）はオーナーが中身と日時を OK にしてから。投稿は月・金 20時（オーナー決定 2026-11-22）
# 🔴 鍵（~/.config/post-mesh/api_key）は画面に出さない。curl へは標準入力で渡す
# ⚠️ インスタの画像は縦横比 4:5〜1.91:1 だけ（カードは 1080x1350＝4:5）
import json, os, subprocess, sys, glob, mimetypes

API = "https://post-mesh.com/api/v1"
CONN = "cmwqm6ivf00yt01s6cmldbm46"  # @bcc.beauty.co_opertive.chain（2026-11-22 連携）
HERE = os.path.dirname(os.path.abspath(__file__))
AUTH = "Authorization: Bearer " + open(os.path.expanduser("~/.config/post-mesh/api_key")).read().strip()

def call(method, path, body=None):
    cmd = ["curl", "-sS", "-X", method, "-H", "@-", "-H", "Content-Type: application/json", API + path]
    if body is not None: cmd += ["--data-binary", json.dumps(body, ensure_ascii=False)]
    r = subprocess.run(cmd, input=AUTH, capture_output=True, text=True)
    return json.loads(r.stdout) if r.stdout.strip() else {}

def upload(path):
    mt = mimetypes.guess_type(path)[0]
    res = call("POST", "/media/upload-url", {"mime_type": mt, "size_bytes": os.path.getsize(path), "name": os.path.basename(path)})
    if "data" not in res: raise SystemExit(f"upload-url 失敗: {res}")
    r = subprocess.run(["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", "-X", "PUT", "-H", f"Content-Type: {mt}",
                        "--data-binary", f"@{path}", res["data"]["upload_url"]], capture_output=True, text=True)
    if not r.stdout.startswith("2"): raise SystemExit(f"PUT 失敗 {r.stdout} {path}")
    return res["data"]["media_id"]

def main():
    sid, kind, date, hhmm, mode = sys.argv[1:6]
    d = json.load(open(os.path.join(HERE, "drafts", f"{sid}.json"), encoding="utf-8"))
    caption = d["caption"] + "\n\n" + " ".join(d.get("hashtags", []))
    body = {"scheduled_at": f"{date}T{hhmm}:00+09:00",
            "targets": [{"connection_id": CONN, "caption": caption, "is_ai_generated": False}]}
    if kind == "carousel":
        files = sorted(glob.glob(os.path.join(HERE, "out", f"{sid}-[0-9]*.png")), key=lambda p: int(p.rsplit("-", 1)[1].split(".")[0]))
        if not 2 <= len(files) <= 10: raise SystemExit(f"画像が {len(files)} 枚（2〜10枚で出す）")
        body.update(category="image", media_ids=[upload(f) for f in files])
    elif kind == "reel":
        v = os.path.join(HERE, "out", f"{sid}-reel.mp4")
        body.update(category="video", media_id=upload(v), thumbnail_time=float(d.get("reel_cover_sec", 8.0)))
    else: raise SystemExit("carousel か reel")
    if mode == "--draft": body["draft"] = True
    elif mode != "--schedule": raise SystemExit("--draft か --schedule を付ける")
    res = call("POST", "/posts", body)
    print(json.dumps(res, ensure_ascii=False)[:800])
    # 出した記録（plan.mjs が古い順にネタを選ぶのに使う）
    if mode == "--schedule" and res.get("data", {}).get("id"):
        pj = os.path.join(HERE, "posted.json")
        posted = json.load(open(pj)) if os.path.exists(pj) else {}
        posted.setdefault(sid, date)
        json.dump(posted, open(pj, "w"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
