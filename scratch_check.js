import fs from 'fs';

const content = fs.readFileSync('./src/data/fyjcCutoffs.ts', 'utf8');
const cats = new Set();
const matches = content.matchAll(/"category":\s*"([^"]+)"/g);
for (const m of matches) {
  cats.add(m[1]);
}
console.log('Categories in FYJC_CUTOFFS:', Array.from(cats));

// Read CUTOFFS from cutoffs.ts as well
const cutoffsContent = fs.readFileSync('./src/data/cutoffs.ts', 'utf8');
const cMatches = cutoffsContent.matchAll(/"category":\s*"([^"]+)"/g);
const cutoffsCats = new Set();
for (const m of cMatches) {
  cutoffsCats.add(m[1]);
}
console.log('Categories in cutoffs.ts:', Array.from(cutoffsCats));
