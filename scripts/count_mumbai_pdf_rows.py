import pypdf
import re

mumbai_pdfs = [
    ('Arts', 'public/pdfs/Arts (Mumbai).pdf'),
    ('Commerce', 'public/pdfs/Commerce Mumbai1).pdf'),
    ('Science', 'public/pdfs/Science (Mumbai).pdf'),
]

total_pdf_rows = 0
pdf_rows_by_stream = {}

for stream, path in mumbai_pdfs:
    reader = pypdf.PdfReader(path)
    count = 0
    mu_codes = set()
    for page in reader.pages:
        text = page.extract_text() or ''
        for line in text.splitlines():
            # Match lines that contain MU choice code
            m = re.search(r'\b(MU\d+[A-Z0-9]{3})\b', line)
            if m:
                count += 1
                mu_codes.add(m.group(1))
    pdf_rows_by_stream[stream] = (count, len(mu_codes))
    total_pdf_rows += count
    print(f"{stream}: {count} rows extracted, {len(mu_codes)} unique choice codes")

print(f"Total rows in 3 Mumbai PDFs: {total_pdf_rows}")
