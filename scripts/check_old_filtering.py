import re

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

def old_match_item_region(item, target_region):
    text = (item['title'] + ' ' + item['badgeSub'] + ' ' + ' '.join(item['meta'])).upper()
    if target_region == 'South Mumbai':
        return (
            'SOUTH MUMBAI' in text or 'CHURCHGATE' in text or
            'CHARNI' in text or 'FORT' in text or
            'MARINE' in text or 'SOUTH' in text or
            'PAREL' in text or 'WORLI' in text or
            'COLABA' in text or 'GRANT ROAD' in text
        )
    if target_region == 'Western Suburbs':
        return (
            'WESTERN' in text or 'VILE PARLE' in text or
            'ANDHERI' in text or 'BORIVALI' in text or
            'BANDRA' in text or 'MALAD' in text or
            'KANDIVALI' in text or 'GOREGAON' in text or
            'SANTACRUZ' in text or 'SUBURBS' in text
        )
    if target_region == 'Central Suburbs':
        return (
            'CENTRAL' in text or 'MATUNGA' in text or
            'DADAR' in text or 'KURLA' in text or
            'SION' in text or 'VIDYAVIHAR' in text
        )
    return True

print("=== OLD MATCH RESULTS FOR 'Western Suburbs' ===")
for c in colleges:
    if old_match_item_region(c, 'Western Suburbs'):
        print(f"  Matched: {c['collegeId']} ({c['badgeSub']})")

print("\n=== OLD MATCH RESULTS FOR 'South Mumbai' ===")
for c in colleges:
    if old_match_item_region(c, 'South Mumbai'):
        print(f"  Matched: {c['collegeId']} ({c['badgeSub']})")
