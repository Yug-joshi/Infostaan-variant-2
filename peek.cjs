const xlsx = require('xlsx');

const workbook = xlsx.readFile('d:/Projects/Infostaan/V2/CLASSES LIST 1.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log('Columns:', data[0]);
console.log('Row 1:', data[1]);
console.log('Total rows:', data.length);
