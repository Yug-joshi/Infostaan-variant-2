import pypdf
import re

state_pdfs = [
    ('Arts State', 'public/pdfs/Arts.pdf'),
    ('Commerce State', 'public/pdfs/Commerce.pdf'),
    ('Science State', 'public/pdfs/Science.pdf'),
]

for name, path in state_pdfs:
    reader = pypdf.PdfReader(path)
    mu_codes = set()
    total_pages = len(reader.pages)
    print(f"Scanning {name} ({total_pages} pages)...")
    for i, p in enumerate(reader.pages):
        text = p.extract_text() or ''
        # Find all MU choice codes
        codes = re.findall(r'\b(MU\d+[A-Z]{3})\b', text)
        mu_codes.update(codes)
    print(f"  {name}: Found {len(mu_codes)} distinct MU choice codes")
