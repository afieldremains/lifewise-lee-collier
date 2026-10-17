"""Render banner HTML to PNGs (and review frames) with Playwright + Edge.

usage: python render.py [final]      -> writes @1x/@3x PNGs next to the HTML
       python render.py frames DIR   -> writes timeline frames into DIR
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
FILES = sorted(ROOT.glob("lifewise-lee-collier-banner-*-320x480.html"))
FINAL_MS = 5200


def seek(page, ms):
    page.evaluate(
        """ms => {
          document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; });
          document.querySelectorAll('svg').forEach(s => { s.pauseAnimations(); s.setCurrentTime(ms / 1000); });
        }""",
        ms,
    )


def shot(p, html, scale, ms, out):
    page = p.new_page(viewport={"width": 320, "height": 480}, device_scale_factor=scale)
    page.goto(html.as_uri())
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(250)
    seek(page, ms)
    page.wait_for_timeout(120)
    page.screenshot(path=str(out))
    page.close()


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "final"
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="msedge")
        for f in FILES:
            stem = f.name[: -len(".html")]
            if mode == "frames":
                out = Path(sys.argv[2])
                out.mkdir(parents=True, exist_ok=True)
                for ms in (300, 800, 1300, 1900, 2600, FINAL_MS, 9000):
                    shot(browser, f, 2, ms, out / f"{stem.split('-')[4]}-{ms}.png")
            else:
                shot(browser, f, 1, FINAL_MS, ROOT / f"{stem}.png")
                shot(browser, f, 3, FINAL_MS, ROOT / f"{stem}@3x.png")
        browser.close()


if __name__ == "__main__":
    main()
