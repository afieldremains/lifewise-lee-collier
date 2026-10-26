# LifeWise Lee + Collier landing page

A static campaign landing page for LifeWise Academy in Lee and Collier counties, Florida.

## Live site

https://afieldremains.github.io/lifewise-lee-collier/

## Deployment

GitHub Actions deploys the site to GitHub Pages whenever a commit is pushed to `main`. The public site contains `index.html`, `styles.css`, `script.js`, `assets/`, and the built 320×480 banner ads in `banners/` (HTML plus PNG previews); project notes and workflow files are not copied to the deployed site.

Banner sources live in `banners/src`. Rebuild with `python banners/build.py` and re-render previews with `python banners/render.py` (needs Playwright and Pillow).

Donations are processed by LifeWise Academy's official giving checkout.

## Photography

The supplied images are preserved byte-for-byte in `assets/originals/`: classroom
2000 x 1287, bus 2000 x 1228, and illustrative community group 1536 x 1024.
The page uses quality-95 WebP derivatives at 800, 1200, and original pixel width,
without upscaling, selected through responsive `srcset`/`sizes`. The existing
full-size JPEGs remain available for banner sources and social sharing.
The community image is illustrative, not evidence of a local event.

The current local-section image is `assets/lifewise-bus-city.webp`, the user's
replacement supplied at 1480 x 880. It is preserved unchanged and displayed in
full without stretching or cropping. Older bus derivatives remain available
for existing banner assets but are no longer used by the landing page.

The classroom and bus also have 3840-pixel-wide WebP exports (3840 x 2471
and 3840 x 2358), selected only when the responsive image slot and screen density
need them. These are high-quality Lanczos enlargements of the earlier
2000-pixel supplied PNGs, not native 4K captures or reconstructed detail.
The newly reattached 474-pixel JPEGs were not used to replace those better
sources. Photo zoom/parallax is disabled to avoid needless magnification and
moving crops; images retain their aspect ratio with responsive cover framing.

## Giving and launch checks

Donation tiers and the two custom-amount forms pass `amount` to the official
checkout. Each form submits only its own amount, and entering an amount clears
the other field. Both require at least $1 and accept cents. They work without
JavaScript using native browser validation and GET navigation.

The checkout's acceptance of the amount parameter and default gift frequency
must be checked manually before promoting the campaign: its Cloudflare service
blocked automated browser inspection during the October 26, 2026 launch pass.
No payment or personal-data form was submitted. Copy therefore asks donors to
confirm amount, frequency (choose One time for a year-end gift), and program.
Local program availability and gift designation remain unverified.

Use the HTTPS live URL above, not an old `file://` preview. Publishing updates
GitHub Pages; it does not update another local checkout or a browser tab opened
from that checkout. CSS/JS use release query strings and responsive photos use
new filenames to avoid stale cached assets.
