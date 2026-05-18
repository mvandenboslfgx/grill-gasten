/**
 * Genereert scherpe WebP-varianten uit PNG in public/images/food/.
 * Run: node scripts/optimize-food-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const FOOD_DIR = path.join(process.cwd(), "public", "images", "food");
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 92;

const files = fs.readdirSync(FOOD_DIR).filter((f) => f.endsWith(".png"));

if (files.length === 0) {
  console.log("Geen PNG’s in public/images/food/");
  process.exit(0);
}

for (const file of files) {
  const input = path.join(FOOD_DIR, file);
  const base = file.replace(/\.png$/i, "");
  const output = path.join(FOOD_DIR, `${base}.webp`);

  const pipeline = sharp(input).rotate();
  const meta = await pipeline.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  let img = sharp(input).rotate();
  if (w > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await img
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.25 })
    .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
    .toFile(output);

  const outMeta = await sharp(output).metadata();
  console.log(`${file} → ${base}.webp (${outMeta.width}x${outMeta.height})`);
}
