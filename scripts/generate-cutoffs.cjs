const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const files = [
  'Arts %.xlsx',
  'Commerce %.xlsx',
  'Science %.xlsx'
];

const V2_DIR = 'd:/Projects/Infostaan/V2';
const OUTPUT_FILE = 'd:/Projects/Infostaan/V2/Infostaan-variant-2/src/data/fyjcCutoffs.ts';

const categories = [
  { raw: 'SC', pct: 'SC %', label: 'SC' },
  { raw: 'ST', pct: 'ST %', label: 'ST' },
  { raw: 'VJA', pct: 'VJA %', label: 'VJA' },
  { raw: 'NTB', pct: 'NTB %', label: 'NTB' },
  { raw: 'NTC', pct: 'NTC %', label: 'NTC' },
  { raw: 'NTD', pct: 'NTD %', label: 'NTD' },
  { raw: 'OBC', pct: 'OBC %', label: 'OBC' },
  { raw: 'SBC', pct: 'SBC %', label: 'SBC' },
  { raw: 'SEBC', pct: 'SEBC %', label: 'SEBC' },
  { raw: 'EWS', pct: 'EWS %', label: 'EWS' },
  { raw: 'General', pct: 'General %', label: 'General' },
];

let allCutoffs = [];
let idCounter = 1;

for (const file of files) {
  console.log(`Processing ${file}...`);
  const wb = xlsx.readFile(path.join(V2_DIR, file));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);
  
  for (const row of data) {
    if (row['ReservationDetails'] !== 'Remaining seats (Pure)') continue;
    
    const collegeName = row['collegename'];
    if (!collegeName) continue;
    
    const stream = row['stream'];
    const choiceCode = row['choicecode'];
    
    for (const cat of categories) {
      let cutoffVal = row[cat.pct];
      
      if (cutoffVal === undefined || cutoffVal === null || cutoffVal === '-' || cutoffVal === '--') continue;
      
      // Parse cutoff. Note: some percentages might be 0.872 (87.2%), others might be strings
      let num = parseFloat(cutoffVal);
      if (isNaN(num)) continue;
      
      if (num < 1) {
        num = num * 100;
      }
      
      num = Math.round(num * 100) / 100;
      
      allCutoffs.push({
        id: `fc_${idCounter++}`,
        collegeId: null, // Will let UI map it via string matching or predefined maps
        collegeName: collegeName.trim(),
        stream: stream.trim(),
        category: cat.label,
        year: '2025-26', // Hardcoded as per original
        cutoff: num,
        choiceCode: choiceCode ? choiceCode.trim() : ''
      });
    }
  }
}

const tsContent = `export interface FyjcCutoff {
  id: string;
  collegeId: string | null;
  collegeName: string;
  stream: string;
  category: string;
  year: string;
  cutoff: number;
  choiceCode: string;
}

export const FYJC_CUTOFFS: FyjcCutoff[] = ${JSON.stringify(allCutoffs, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, tsContent);
console.log(`Generated ${allCutoffs.length} cutoffs from Excel files.`);
