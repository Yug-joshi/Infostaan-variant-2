const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const DATA_DIR = path.join(__dirname, '../src/data');
const PUBLIC_PDF_DIR = path.join(__dirname, '../public/pdfs');
const V2_DIR = 'd:/Projects/Infostaan/V2';

// 1. IMPORT CLASSES
function importClasses() {
  console.log('Importing classes...');
  const workbook = xlsx.readFile(path.join(V2_DIR, 'CLASSES LIST 1.xlsx'));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  const classes = [];
  const headers = rawData[0];
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || !row[1]) continue;
    
    // ['Sr No', 'Class Name', 'Region', 'Area', 'Streams Offered', 'Specializations', 'Address', 'Contact Number', 'Website']
    const className = String(row[1] || '').trim();
    if (!className) continue;
    
    // Create a simple slug
    const slug = className.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + i;
    
    const cls = {
      id: `class_${i}`,
      slug,
      name: className,
      region: row[2] ? String(row[2]).trim() : undefined,
      area: row[3] ? String(row[3]).trim() : undefined,
      streams: row[4] ? String(row[4]).trim() : undefined,
      specializations: row[5] ? String(row[5]).trim() : undefined,
      address: row[6] ? String(row[6]).trim() : undefined,
      contact: row[7] !== '[Not specified]' ? String(row[7]).trim() : undefined,
      website: row[8] !== '[Not specified]' ? String(row[8]).trim() : undefined,
    };
    
    classes.push(cls);
  }
  
  const tsContent = `export interface ClassData {
  id: string;
  slug: string;
  name: string;
  region?: string;
  area?: string;
  streams?: string;
  specializations?: string;
  address?: string;
  contact?: string;
  website?: string;
}

export const CLASSES: ClassData[] = ${JSON.stringify(classes, null, 2)};
`;

  fs.writeFileSync(path.join(DATA_DIR, 'classes.ts'), tsContent);
  console.log(`Imported ${classes.length} classes.`);
}

// 2. PROCESS PDFs
function processPDFs() {
  console.log('Processing PDFs...');
  if (!fs.existsSync(PUBLIC_PDF_DIR)) {
    fs.mkdirSync(PUBLIC_PDF_DIR, { recursive: true });
  }

  const files = fs.readdirSync(V2_DIR).filter(f => f.endsWith('.pdf'));
  const cutoffs = [];
  
  files.forEach((file, index) => {
    // Copy file
    fs.copyFileSync(path.join(V2_DIR, file), path.join(PUBLIC_PDF_DIR, file));
    
    const id = `cutoff_${index + 1}`;
    const slug = file.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Guess metadata from filename
    let stream = 'General';
    if (file.toLowerCase().includes('arts')) stream = 'Arts';
    if (file.toLowerCase().includes('commerce')) stream = 'Commerce';
    if (file.toLowerCase().includes('science')) stream = 'Science';

    const cutoff = {
      id,
      slug,
      collegeId: 'mithibai', // Simplified association for prototype; we will associate it dynamically in code
      collegeName: 'Multiple Mumbai Colleges',
      academicYear: '2025-26',
      stream,
      documentTitle: file.replace('.pdf', ''),
      sourceFile: `/pdfs/${file}`,
      description: `Official cutoff document for ${stream} stream in Mumbai.`
    };
    
    cutoffs.push(cutoff);
    
    // Add a second association for HR College for commerce
    if (stream === 'Commerce') {
      cutoffs.push({
        ...cutoff,
        id: id + '_hr',
        collegeId: 'hr-college'
      });
    }
  });

  const tsContent = `export interface CutoffMetadata {
  id: string;
  slug: string;
  collegeId?: string;
  collegeName?: string;
  courseId?: string;
  academicYear?: string;
  stream?: string;
  documentTitle: string;
  sourceFile: string;
  description?: string;
}

export const CUTOFFS: CutoffMetadata[] = ${JSON.stringify(cutoffs, null, 2)};
`;

  fs.writeFileSync(path.join(DATA_DIR, 'cutoffs.ts'), tsContent);
  console.log(`Processed ${files.length} PDFs into ${cutoffs.length} cutoff records.`);
}

importClasses();
processPDFs();
