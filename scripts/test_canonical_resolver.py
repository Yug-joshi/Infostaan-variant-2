import re

# Comprehensive locality mapping with strict word boundaries
LOCALITY_TO_REGION = {
    # South Mumbai
    'Churchgate': 'South Mumbai',
    'Colaba': 'South Mumbai',
    'Fort': 'South Mumbai',
    'Marine Lines': 'South Mumbai',
    'Marine Drive': 'South Mumbai',
    'Nariman Point': 'South Mumbai',
    'Cuffe Parade': 'South Mumbai',
    'Charni Road': 'South Mumbai',
    'Grant Road': 'South Mumbai',
    'Mumbai Central': 'South Mumbai',
    'Mahalaxmi': 'South Mumbai',
    'Mahalakshmi': 'South Mumbai',
    'Lower Parel': 'South Mumbai',
    'Worli': 'South Mumbai',
    'Parel': 'South Mumbai',
    'Elphinstone': 'South Mumbai',
    'Elphinstone Road': 'South Mumbai',
    'Prabhadevi': 'South Mumbai',
    'Currey Road': 'South Mumbai',
    'Byculla': 'South Mumbai',
    'Mazgaon': 'South Mumbai',
    'Girgaon': 'South Mumbai',
    'Girgaum': 'South Mumbai',
    'Chowpatty': 'South Mumbai',
    'Walkeshwar': 'South Mumbai',
    'Malabar Hill': 'South Mumbai',
    'Pedder Road': 'South Mumbai',
    'Cumballa Hill': 'South Mumbai',
    'Breach Candy': 'South Mumbai',
    'Dhobi Talao': 'South Mumbai',
    'Kalbadevi': 'South Mumbai',
    'Tardeo': 'South Mumbai',
    'Sewri': 'South Mumbai',

    # Western Suburbs
    'Bandra': 'Western Suburbs',
    'Bandra West': 'Western Suburbs',
    'Bandra East': 'Western Suburbs',
    'BKC': 'Western Suburbs',
    'Khar': 'Western Suburbs',
    'Santacruz': 'Western Suburbs',
    'Vile Parle': 'Western Suburbs',
    'Vile Parle West': 'Western Suburbs',
    'Vile Parle East': 'Western Suburbs',
    'Juhu': 'Western Suburbs',
    'Versova': 'Western Suburbs',
    'Andheri': 'Western Suburbs',
    'Andheri West': 'Western Suburbs',
    'Andheri East': 'Western Suburbs',
    'Jogeshwari': 'Western Suburbs',
    'Goregaon': 'Western Suburbs',
    'Malad': 'Western Suburbs',
    'Malad West': 'Western Suburbs',
    'Malad East': 'Western Suburbs',
    'Kandivali': 'Western Suburbs',
    'Kandivali West': 'Western Suburbs',
    'Kandivali East': 'Western Suburbs',
    'Borivali': 'Western Suburbs',
    'Borivali West': 'Western Suburbs',
    'Borivali East': 'Western Suburbs',
    'Dahisar': 'Western Suburbs',
    'Mira Road': 'Western Suburbs',
    'Bhayandar': 'Western Suburbs',
    'Naigaon': 'Western Suburbs',
    'Vasai': 'Western Suburbs',
    'Nalasopara': 'Western Suburbs',
    'Virar': 'Western Suburbs',

    # Central Suburbs
    'Dadar': 'Central Suburbs',
    'Matunga': 'Central Suburbs',
    'Matunga Central': 'Central Suburbs',
    'Wadala': 'Central Suburbs',
    'Sion': 'Central Suburbs',
    'Sion West': 'Central Suburbs',
    'Sion East': 'Central Suburbs',
    'Kurla': 'Central Suburbs',
    'Vidyavihar': 'Central Suburbs',
    'Tilak Nagar': 'Central Suburbs',
    'Chunabhatti': 'Central Suburbs',

    # Eastern Suburbs
    'Ghatkopar': 'Eastern Suburbs',
    'Vikhroli': 'Eastern Suburbs',
    'Kanjurmarg': 'Eastern Suburbs',
    'Bhandup': 'Eastern Suburbs',
    'Nahur': 'Eastern Suburbs',
    'Mulund': 'Eastern Suburbs',
    'Mulund West': 'Eastern Suburbs',
    'Mulund East': 'Eastern Suburbs',
    'Powai': 'Eastern Suburbs',
    'Chandivali': 'Eastern Suburbs',

    # Harbour / Central-East
    'Chembur': 'Harbour / Central-East',
    'Govandi': 'Harbour / Central-East',
    'Mankhurd': 'Harbour / Central-East',
    'Trombay': 'Harbour / Central-East',
    'Vashi': 'Harbour / Central-East',
    'Sanpada': 'Harbour / Central-East',
    'Nerul': 'Harbour / Central-East',
    'Belapur': 'Harbour / Central-East',
    'CBD Belapur': 'Harbour / Central-East',
    'Kharghar': 'Harbour / Central-East',
    'Panvel': 'Harbour / Central-East',
    'Navi Mumbai': 'Harbour / Central-East',
}

CANONICAL_REGIONS = [
    'South Mumbai',
    'Western Suburbs',
    'Central Suburbs',
    'Eastern Suburbs',
    'Harbour / Central-East',
]

def resolve_item_region(item):
    badge = item.get('badgeSub', '')
    meta_list = item.get('meta', [])
    
    # 1. Check explicit region in badgeSub or meta
    for r in CANONICAL_REGIONS:
        if r in badge:
            return r
        for m in meta_list:
            if f"Region: {r}" in m or m.strip() == r:
                return r
                
    # 2. Check localities in badgeSub first, then meta, then title
    # Clean text of railway line keywords so "Western Line" doesn't falsely match
    cleaned_badge = re.sub(r'\b(Western|Central|Harbour)\s+(Line|Corridor|Railway)\b', '', badge, flags=re.I)
    
    for loc, reg in LOCALITY_TO_REGION.items():
        if re.search(r'\b' + re.escape(loc) + r'\b', cleaned_badge, re.I):
            return reg
            
    # Check meta items
    for m in meta_list:
        cleaned_m = re.sub(r'\b(Western|Central|Harbour)\s+(Line|Corridor|Railway)\b', '', m, flags=re.I)
        for loc, reg in LOCALITY_TO_REGION.items():
            if re.search(r'\b' + re.escape(loc) + r'\b', cleaned_m, re.I):
                return reg
                
    return None

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

college_blocks = re.findall(r'\{\s*id:\s*\'([^\']+)\',\s*category:\s*\'colleges\'(.*?)\n  \},', text, re.DOTALL)
colleges = []
for cid, body in college_blocks:
    title_m = re.search(r'title:\s*\'([^\']+)\'', body)
    college_id_m = re.search(r'collegeId:\s*\'([^\']+)\'', body)
    badge_sub_m = re.search(r'badgeSub:\s*\'([^\']+)\'', body)
    meta_m = re.findall(r'meta:\s*\[(.*?)\]', body, re.DOTALL)
    meta = []
    if meta_m:
        meta = [m.strip().strip("'\"") for m in meta_m[0].split(',') if m.strip()]
    colleges.append({
        'id': cid,
        'collegeId': college_id_m.group(1) if college_id_m else '',
        'title': title_m.group(1) if title_m else '',
        'badgeSub': badge_sub_m.group(1) if badge_sub_m else '',
        'meta': meta
    })

print("=== RESOLVED CANONICAL REGIONS FOR CURATED COLLEGES ===")
by_region = {}
for c in colleges:
    reg = resolve_item_region(c)
    by_region.setdefault(reg, []).append(c)
    print(f"[{c['collegeId']}] ({c['badgeSub']}) => {reg}")

print("\n=== BREAKDOWN BY REGION ===")
for r, cols in by_region.items():
    print(f"{r}: {len(cols)} colleges: {[c['collegeId'] for c in cols]}")
