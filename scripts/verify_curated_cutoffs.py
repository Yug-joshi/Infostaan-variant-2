import re, json

with open('src/data/fyjcCutoffs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'\{\s*"id":\s*"([^"]+)",\s*'
    r'"collegeId":\s*([^,]+),\s*'
    r'"collegeName":\s*"([^"]+)",\s*'
    r'"stream":\s*"([^"]+)",\s*'
    r'"category":\s*"([^"]+)",\s*'
    r'"year":\s*"([^"]+)",\s*'
    r'"cutoff":\s*([0-9.]+),\s*'
    r'"choiceCode":\s*"([^"]+)"\s*\}',
    re.MULTILINE
)
matches = pattern.findall(text)

curated_codes = {
    'mithibai': ['MU7133'],
    'hinduja': ['MU6746'],
    'podar': ['MU6833'],
    'jai-hind': ['MU6727'],
    'xaviers': ['MU6724'],
    'sies-college': ['MU6831', 'MU6830'],
    'bhavans-college': ['MU7125'],
    'dahanukar-college': ['MU7152'],
    'somaiya-college': ['MU6917', 'MU6916', 'MU6891'],
    'somaiya': ['MU6917', 'MU6916', 'MU6891'],
    'sophia-college': ['MU6750'],
    'wilson-college': ['MU6743'],
    'ruparel-college': ['MU6768'],
    'ruparel': ['MU6768'],
    'rizvi-college': ['MU7061'],
    'vaze-college': ['MU7024'],
    'hr-college': ['MU6719', 'MU6728'],
    'nm-college': ['MU7123', 'MU7134'],
    'md-college': ['MU6798'],
    'kc-college': ['MU6718'],
    'ruia': ['MU6832'],
}

code_to_curated = {}
for cid, codes in curated_codes.items():
    for c in codes:
        code_to_curated[c] = cid

print("=== VERIFYING CUTOFFS FOR CURATED COLLEGES ===")
for cid, codes in curated_codes.items():
    if cid in ('somaiya', 'ruparel'): continue
    # Find matching rows
    matched = []
    for m in matches:
        code_prefix = m[7][:6] if len(m[7]) >= 6 else ''
        c_id_field = m[1].strip().strip('"').lower()
        if c_id_field == cid.lower() or c_id_field == cid.replace('-college', '').lower() or code_prefix in codes:
            matched.append(m)
            
    streams = set(m[3] for m in matched)
    categories = set(m[4] for m in matched)
    print(f"\nCollege [{cid}]: {len(matched)} cutoff records found")
    print(f"  Streams ({len(streams)}): {streams}")
    print(f"  Categories: {len(categories)}")
    for s in sorted(streams):
        s_cutoffs = [float(m[6]) for m in matched if m[3] == s and m[4] == 'General']
        if s_cutoffs:
            print(f"    - {s} General: {min(s_cutoffs)}% - {max(s_cutoffs)}%")
        else:
            all_s = [float(m[6]) for m in matched if m[3] == s]
            print(f"    - {s} (all cats): {min(all_s)}% - {max(all_s)}%")
