# LifeWise Lee + Collier landing page

A static campaign landing page for LifeWise Academy in Lee and Collier counties, Florida.

## Live site

https://afieldremains.github.io/lifewise-lee-collier/

## Deployment

GitHub Actions deploys the site to GitHub Pages whenever a commit is pushed to `main`. The public site contains `index.html`, `styles.css`, `script.js`, `assets/`, and the built 320×480 banner ads in `banners/` (HTML plus PNG previews); project notes and workflow files are not copied to the deployed site.

Banner sources live in `banners/src`. Rebuild with `python banners/build.py` and re-render previews with `python banners/render.py` (needs Playwright and Pillow).

Donations are processed by LifeWise Academy's official giving checkout.
