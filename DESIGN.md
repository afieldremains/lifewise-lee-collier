# Design system

## Direction

The Lee + Collier landing page is a county-focused campaign poster built around the LifeWise school-day classroom. It uses a timetable-like reading path to explain the program, then shifts into direct local-giving guidance. Do not imply that a LifeWise program is active in either county unless that fact is confirmed.

The first viewport exposes both primary actions: donate through the official checkout or jump to volunteer pathways. Keep volunteer choices as an open editorial list rather than cards, and label LifeWise’s Street Team, launch, and church resources as general pathways until local availability is confirmed.

## LifeWise.org alignment

The page mirrors lifewise.org's look: Lato body and headings, Bebas Neue for the
uppercase hero and band headings (Google Fonts stand-ins for LifeWise's Typekit
lato and bebas-kai), a #333 top ribbon, full-width red header with an outlined
white Volunteer pill and a yellow Donate pill, a centred red-tinted photo hero,
then alternating red, sage (`#afcbc7`), white, and #333 bands, a light gray
(`#f2f2f2`) footer and a red Prime credit bar. Buttons are 50px pills.
Florida sun, waves, beach, and bubbles stay as campaign accents. Do not copy or
hotlink LifeWise.org logo files. Yellow on red is large-text only (~3.5:1);
use deep red `#a8242a` for small red text on sage or gray.

## Palette

- LifeWise red: `#cf3339`
- LifeWise yellow: `#f6d44d`
- LifeWise blue: `#00bfed`
- Charcoal: `#333333` (header ribbon, values band, sun disc)
- Sage: `#afcbc7`
- Footer gray: `#f2f2f2`
- Navy ink: `#102d4b`
- Deep navy: `#0a223b`
- Paper: `#fffdf7`
- Pale blue: `#d9f3fa`

Use red, yellow, and blue as large, deliberate fields, with navy for readable text and structure. Keep body copy on paper or navy surfaces; use white text on red and navy text on yellow.

Editable "Academy" text in LifeWise branding and copy is yellow on a navy
backing so it remains readable on light surfaces. Preserve supplied photos;
do not recolor lettering embedded in them.

The hero's Florida sun badge combines the campaign's LifeWise wordmark with
golden tapered rays and a warm yellow disc, with yellow Academy lettering on
navy. A gentle outward ray pulse and radiating ring run only while visible,
respect reduced motion, and obey the page's pause control. Its labeled native disclosure opens quick navigation
with giving first, then program, local support, volunteering, and the giving FAQ.
Keep it in normal flow rather than covering copy or photography; preserve
keyboard activation, visible focus, Escape dismissal, and no-JavaScript use.

Layered sky, ocean blue, navy, and paper waves bridge the hero/program and
giving/FAQ boundaries. Keep these dividers static, decorative, noninteractive,
and outside the reading and keyboard order; the sun is the coastal focal motion.

## Type and layout

Use Roboto with Arial fallback. Headlines are heavy, tightly tracked, and balanced; body text stays comfortable to read. Keep the wide desktop hero split between a yellow copy field and classroom photography. At narrow widths, stack copy before imagery so the local offer and donation action remain first.

The school-day section uses a single rule and three stops rather than cards. Keep the county context visible in the top ribbon and hero.

## Imagery

- `assets/lifewise-teacher.jpg`: lead classroom image (teacher with binder); the hero uses its WebP derivatives.
- `assets/lifewise-bus.jpg`: program-context image.
- `assets/community-volunteers.jpg`: illustrative community image, not a local LifeWise event.

Do not caption the supplied imagery as a Lee or Collier County event.

## Interaction and accessibility

Use native links, buttons, and disclosure elements. The mobile navigation must expose its expanded state and close on link activation or Escape. Preserve visible keyboard focus and honor reduced-motion preferences. Authored motion: hero-photo reveal, the pulsing sun and its scroll flight to a docked controller, the wave-crash transition into the giving section, shoreline lapping, and the Prime Digital Connect logo's spin-and-pop hover. All of it stops for reduced motion and the Pause animations control.

The footer studio credit uses the Prime colour mark (blue #1d4ed8 stem, red #e1251b ring, white star) on a white chip; hover turns the chip Prime yellow #f7c400, echoing the on-yellow logo variant. Monochrome and on-yellow lockups live in `assets/prime-logo-*.svg`.

Brand bubbles are decorative (`aria-hidden`). Keep their marks faint (crest about 30% opacity, Prime colour and white monochrome marks about 20%) so they read as texture, never as content, and animate only transform-based properties.

The quick-give card is the boldest donation surface: a yellow card with a red offset shadow, navy amount chips and a red full-width CTA. Keep small text on yellow navy (red fails contrast below large-text sizes). The floating donate pill hides while this card or the giving section is on screen.
