import pypdf

pdfs = [
    'public/pdfs/Arts (Mumbai).pdf',
    'public/pdfs/Commerce Mumbai1).pdf',
    'public/pdfs/Science (Mumbai).pdf',
    'public/pdfs/Commerce.pdf',
]

terms = ['KHANDWALA', 'SHROFF', 'NAGINDAS', 'DAYANAND', 'MAHARSHI', 'SYDENHAM', 'CHINAI']

for pdf_path in pdfs:
    print(f"\n--- Checking {pdf_path} ---")
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}")
    
    found_pages = {}
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        text_upper = text.upper()
        for term in terms:
            if term in text_upper:
                if term not in found_pages:
                    found_pages[term] = []
                found_pages[term].append(i + 1)
                
    for term, pages in found_pages.items():
        print(f"  Found '{term}' on pages: {pages[:5]} (total {len(pages)})")
