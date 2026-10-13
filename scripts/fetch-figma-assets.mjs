// Downloads the photos and floral SVGs used by the design into public/images.
//
//   node scripts/fetch-figma-assets.mjs
//
// These links come straight from the Figma file and EXPIRE 7 DAYS after they
// were generated. If you get 403/404 errors, the links have expired: ask Claude
// to re-run the Figma design context and refresh this list, or export the
// layers by hand from Figma (select layer > Export) using the file names below.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const BASE = "https://www.figma.com/api/mcp/asset";

const ASSETS = {
  // Hero: couple photo (the arch that opens on scroll)
  "hero.png": `${BASE}/378e3b56-3f05-4089-9c22-3f59ef877d80/43726.png`,

  // Welcome section: three arch photos + the rotated floral frame
  "gallery-1.png": `${BASE}/7244468b-f9fd-449f-a0ae-c4bf759a9326/6d34a.png`,
  "gallery-2.png": `${BASE}/7244468b-f9fd-449f-a0ae-c4bf759a9326/bf30d.png`,
  "gallery-3.png": `${BASE}/7244468b-f9fd-449f-a0ae-c4bf759a9326/f074c.png`,
  "floral-frame.svg": `${BASE}/7244468b-f9fd-449f-a0ae-c4bf759a9326/08cbb.svg`,

  // The day section: gold floral border along the bottom
  "floral-bottom-gold.svg": `${BASE}/d24ea54b-0a9a-40be-bf09-138d784bdf53/20048.svg`,

  // Venue section: photo + brown floral border
  "venue.png": `${BASE}/73a76be1-1f61-4df6-8c26-99f3a4471ff4/bbd2b.png`,
  "floral-bottom-brown.svg": `${BASE}/73a76be1-1f61-4df6-8c26-99f3a4471ff4/0b305.svg`,
};

await mkdir(OUT, { recursive: true });

let failed = 0;
for (const [file, url] of Object.entries(ASSETS)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length === 0) throw new Error("empty response");
    await writeFile(join(OUT, file), bytes);
    console.log(`ok    ${file}  (${(bytes.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${file}  ${err.message}`);
  }
}

if (failed) {
  console.error(`\n${failed} file(s) failed. The links may have expired (7 days).`);
  process.exit(1);
}
console.log("\nAll assets saved to public/images");
