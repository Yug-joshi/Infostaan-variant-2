import pypdf, re, json

with open('src/data/fyjcCutoffs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'"choiceCode":\s*"([^"]+)"')
fyjc_codes = set(pattern.findall(text))
print(f"Choice codes in fyjcCutoffs.ts: {len(fyjc_codes)}")

mumbai_pdfs = [
    ('Arts', 'public/pdfs/Arts (Mumbai).pdf'),
    ('Commerce', 'public/pdfs/Commerce Mumbai1).pdf'),
    ('Science', 'public/pdfs/Science (Mumbai).pdf'),
]

pdf_codes = {}
for stream, path in mumbai_pdfs:
    reader = pypdf.PdfReader(path)
    for p_num, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        for line in text.splitlines():
            m = re.search(r'\b(MU\d+[A-Z0-9]{3})\b', line)
            if m:
                code = m.group(1)
                pdf_codes[code] = (stream, p_num + 1, line.strip())

print(f"Choice codes in PDFs: {len(pdf_codes)}")
missing = set(pdf_codes.keys()) - fyjc_codes
print(f"Missing from fyjcCutoffs: {len(missing)}")
for c in list(missing)[:10]:
    print(f"  {c}: {pdf_codes[c]}")
