// Genera lib/earth-mask.ts a partir de la textura equirectangular del blog 2021.
// Uso: node scripts/generate-earth-mask.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const W = 144;
const H = 72;

const { data } = await sharp("public/2021/assets/img/earth_texture.jpg")
  .resize(W, H, { fit: "fill" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

let rows = [];
for (let y = 0; y < H; y++) {
  let row = "";
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Océano: azul dominante y oscuro. Tierra: verde/marrón/claro.
    const esTierra = !(b > r + 10 && b > g + 5) || r + g + b > 400;
    row += esTierra ? "#" : ".";
  }
  rows.push(row);
}

const out = `// Autogenerado por scripts/generate-earth-mask.mjs — no editar a mano.
// Máscara de tierra equirectangular ${W}x${H} ('#' tierra, '.' océano),
// derivada de public/2021/assets/img/earth_texture.jpg (blog 2021).
export const EARTH_MASK_W = ${W};
export const EARTH_MASK_H = ${H};
export const EARTH_MASK: string[] = [
${rows.map((r) => `  "${r}",`).join("\n")}
];
`;
writeFileSync("lib/earth-mask.ts", out);
console.log(`lib/earth-mask.ts generado (${W}x${H})`);
// Vista previa reducida para inspección visual
for (let y = 0; y < H; y += 3) {
  let line = "";
  for (let x = 0; x < W; x += 2) line += rows[y][x];
  console.log(line);
}
