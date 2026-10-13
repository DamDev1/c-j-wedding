# C & J Wedding website

Next.js (App Router) + TypeScript + Tailwind CSS v4, built from the Figma design
"C-J Wedding website".

```bash
npm install
npm run fetch-assets   # downloads the photos + floral SVGs into public/images
npm run dev            # http://localhost:3000
```

## Images

The site expects these files in `public/images`. `npm run fetch-assets` downloads
them from Figma, but those links **expire after 7 days**. If it fails, export the
layers from Figma by hand (select layer, Export) and use these names:

| File | Used in |
| --- | --- |
| `hero.png` | Hero arch photo |
| `gallery-1.png`, `gallery-2.png`, `gallery-3.png` | Welcome section arches |
| `floral-frame.svg` | Welcome section floral frame (portrait artwork, rotated in CSS) |
| `floral-bottom-gold.svg` | "The day" bottom border |
| `venue.png` | "The venue" photo |
| `floral-bottom-brown.svg` | "The venue" bottom border |

Missing images don't break the page: photos fall back to a plain colour or
gradient and the floral art simply doesn't show.

## Structure

```
src/app/            layout (fonts), globals.css (tokens + hero scroll CSS), page
src/components/
  Hero.tsx          pinned hero; the arch opens to full screen as you scroll
  Welcome.tsx       "We're getting married" + three arch photos
  TheDay.tsx        3:00 PM / 5:30 PM cards
  Venue.tsx         venue text + photo
  DressCode.tsx     four colour swatches
  Reveal.tsx        fade-in-on-scroll wrapper used by the sections
  Decoration.tsx    floral frame / bottom border
  Button.tsx        pill button
scripts/            fetch-figma-assets.mjs
```

## Tuning the hero reveal

- Scroll length: `h-[240svh]` on the `<section>` in `Hero.tsx` (bigger = slower).
- How early it finishes opening: `p / 0.8` in `apply()`.
- When the invitation text appears: the `t1`, `t2`, `t3` thresholds in `apply()`.
- Starting arch size: `--arch-w` / `--arch-h` in `globals.css`.

Motion respects `prefers-reduced-motion` (the hero shows its finished state with no pin).

## Not built yet

Programme and RSVP sections (header and buttons already link to `#programme`
and `#rsvp`).
