"""Build self-contained LifeWise Lee + Collier banner ads.

Reads src/shared.css + src/{a,b}.html, inlines the Roboto font and a cropped
campaign photo (from ../assets) as base64 and writes ready-to-serve HTML files.
"""
import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
ASSETS = ROOT.parent / "assets"
LANDING = "https://afieldremains.github.io/lifewise-lee-collier/"

BANNERS = {
    "a": {
        "out": "lifewise-lee-collier-banner-A-foundation-320x480.html",
        "photo": ("lifewise-classroom.jpg", (300, 40, 1760, 1010), (1000, 664), 80),
        "content": "a-foundation",
    },
    "b": {
        "out": "lifewise-lee-collier-banner-B-impact-320x480.html",
        "photo": ("lifewise-bus.jpg", (0, 90, 2000, 1228), (1100, 626), 80),
        "content": "b-impact",
    },
}


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def photo_uri(name, box, size, quality):
    img = Image.open(ASSETS / name).convert("RGB").crop(box)
    img = img.resize(size, Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + b64(buf.getvalue())


def main():
    font = b64((SRC / "Roboto-latin-var.woff2").read_bytes())
    css = (SRC / "shared.css").read_text(encoding="utf-8").replace("{{FONT}}", font)
    for key, cfg in BANNERS.items():
        name, box, size, q = cfg["photo"]
        href = (
            f"{LANDING}?utm_source=banner&amp;utm_medium=display"
            f"&amp;utm_campaign=lee-collier-giving&amp;utm_content={cfg['content']}#give"
        )
        html = (SRC / f"{key}.html").read_text(encoding="utf-8-sig")
        html = (
            html.replace("{{CSS}}", css)
            .replace("{{PHOTO}}", photo_uri(name, box, size, q))
            .replace("{{HREF}}", href)
        )
        out = ROOT / cfg["out"]
        out.write_text(html, encoding="utf-8")
        print(f"{cfg['out']}: {out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
