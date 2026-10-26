# LifeWise Lee + Collier landing page

A static campaign landing page for LifeWise Academy in Lee and Collier counties, Florida.

## Live site

https://afieldremains.github.io/lifewise-lee-collier/

## Deployment

GitHub Actions deploys the site to GitHub Pages whenever a commit is pushed to `main`. The public site contains `index.html`, `styles.css`, `script.js`, `assets/`, and the built 320×480 banner ads in `banners/` (HTML plus PNG previews); project notes and workflow files are not copied to the deployed site.

Banner sources live in `banners/src`. Rebuild with `python banners/build.py` and re-render previews with `python banners/render.py` (needs Playwright and Pillow).

Donations are processed by LifeWise Academy's official giving checkout.

## Campaign branding and navigation

The visual style follows lifewise.org (red header with yellow Donate pill,
Bebas uppercase hero, red/sage/white/charcoal bands, gray footer) while keeping
the Florida sun, wave, beach and bubble accents. LifeWise logo files are not
copied; Lato and Bebas Neue load from Google Fonts.

The Florida sun badge is a campaign-specific navigation treatment, not a claim
of a new official LifeWise logo. Tap/click its labeled native disclosure to reach
giving, program information, local support, volunteer options, or the giving
FAQ. It works without JavaScript; enhanced behavior closes on Escape, outside
click, or selection, and moves keyboard focus to the destination.
Editable instances of "Academy" in LifeWise branding and page copy use brand
yellow on navy for contrast. Text embedded in supplied photographs is unchanged.

The sun keeps its LifeWise badge look (red tick rays, charcoal disc, yellow
"Academy") with larger pulsing rays and corona. As visitors scroll, it flies
from the hero to a docked page controller (right edge on desktop, bottom-left on
phones, tucking away while reading down) with a scroll-progress orbit and the
current section marked. Every "Donate now" link goes to the on-page giving
section through a full-screen wave crash that recedes onto an SVG beach; the
donation tiers and Other amount form still open the official checkout. Reduced
motion, the Pause animations control, and no-JavaScript views skip the crash and
keep the sun static. Layered SVG wave dividers bridge sections.

Faint glass bubbles drift in the shoreline sea and rise through the wave crash.
Each carries a near-transparent LifeWise Academy crest or Prime Digital Connect
mark as subtle branding. The crest (`assets/lifewise-crest-white.webp`, 1079x805)
is keyed from the supplied white-on-gray logo with no enlargement. The bubbles
animate only while visible and stay still for reduced motion or when paused.
Visitors can pop shoreline bubbles with a hover or tap; they reform a moment later.

The local section holds a one-tap giving card: four amount chips open the official
checkout directly, and "See every way to give" triggers the wave crash into the
giving section. The page links only to the official checkout, with no direct
contact routes.

## Credit

The footer credits the page as a Prime Digital Connect™ Concept.
The main footer logo is the red, blue and yellow Prime "P" with the star, rebuilt as
vector from the supplied logo (`assets/prime-mark-color.svg`, also copied to
`assets/prime-digital-connect-mark.svg`); `assets/prime-digital-connect-logo-4k.png`
is a transparent 3840x3840 render of that vector. Hovering the logo spins and pops
the mark, twinkles the star and turns the chip Prime yellow (the on-yellow variant);
motion is disabled for reduced motion.

Variations, all vector:

- `assets/prime-logo-yellow.svg`: colour mark with PRIME / DIGITAL CONNECT on yellow.
- `assets/prime-logo-mono-light.svg` and `assets/prime-logo-mono-dark.svg`: monochrome
  P and PRIME wordmark, black on white and white on black.
- `assets/prime-mark-mono.svg`: the monochrome P alone (`currentColor`).

On the page, the faint water bubbles alternate the LifeWise crest, the colour Prime mark
and the white monochrome Prime mark.

## Photography

The hero uses the user's newer teacher photo (`assets/originals/lifewise-teacher.jpg`,
1549 x 997). It has fewer pixels than the earlier 2000 x 1287 classroom PNG but
far more real detail, so it renders visibly sharper at every display size. It is
served as `lifewise-teacher-{800,1200,1549}.webp` plus a 3840 x 2472 Lanczos
enlargement for high-density screens (an enlargement, not native 4K detail), and
`assets/lifewise-teacher.jpg` is the social share image. The older classroom
files remain for banner use.

The other supplied images are preserved byte-for-byte in `assets/originals/`: classroom
2000 x 1287, bus 2000 x 1228, and illustrative community group 1536 x 1024.
The page uses quality-95 WebP derivatives at 800, 1200, and original pixel width,
without upscaling, selected through responsive `srcset`/`sizes`. The existing
full-size JPEGs remain available for banner sources and social sharing.
The community image is illustrative, not evidence of a local event. Its
Copilot watermark was removed by filling from the surrounding sleeve pixels
(`assets/originals/community-volunteers-clean.png`); the page serves
`community-volunteers-clean-{800,1200,1536}.webp` with no text over the photo.

The current local-section image is `assets/lifewise-bus-city.webp`, the user's
replacement supplied at 1480 x 880. It is preserved unchanged and displayed in
full without stretching or cropping. Older bus derivatives remain available
for existing banner assets but are no longer used by the landing page.

The earlier classroom and the bus also have 3840-pixel-wide WebP exports (3840 x 2471
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
