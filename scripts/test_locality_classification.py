import re

with open('src/data/fyjcCutoffs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(
    r'\{\s*"id":\s*"[^"]+",\s*"collegeId":\s*[^,]+,\s*"collegeName":\s*"([^"]+)",'
)
names = set(pattern.findall(text))
print(f"Total distinct college names in fyjcCutoffs: {len(names)}")

# Define locality rules
localities_map = {
    'South Mumbai': [
        'COLABA', 'CUFFE PARADE', 'NARIMAN POINT', 'CHURCHGATE', 'FORT', 'BALLARD ESTATE',
        'MARINE LINES', 'MARINE DRIVE', 'CHARNI ROAD', 'GIRGAON', 'GIRGAUM', 'CHOWPATTY',
        'WALKESHWAR', 'MALABAR HILL', 'PEDDER ROAD', 'CUMBALLA HILL', 'BREACH CANDY',
        'MAHALAXMI', 'MAHALAKSHMI', 'HAJI ALI', 'TARDEO', 'GRANT ROAD', 'MUMBAI CENTRAL',
        'DHOBI TALAO', 'KALBADEVI', 'CRAWFORD', 'BHULESHWAR', 'PYDHONIE', 'BYCULLA', 'MAZGAON',
        'AGRIPADA', 'NAGPADA', 'LAMINGTON', 'LOWER PAREL', 'WORLI', 'PAREL', 'CURREY ROAD',
        'ELPHINSTONE', 'PRABHADEVI', 'SEWRI', 'COTTON GREEN', 'REAY ROAD', 'DOCKYARD'
    ],
    'Western Suburbs': [
        'BANDRA', 'KHAR', 'SANTACRUZ', 'SANTA CRUZ', 'VILE PARLE', 'JUHU', 'VERSOVA',
        'OSHIWARA', 'LOKHANDWALA', 'ANDHERI', 'JOGESHWARI', 'GOREGAON', 'AAREY',
        'MALAD', 'MARVE', 'KANDIVALI', 'KANDIVLI', 'CHARKOP', 'BORIVALI', 'BORIVLI',
        'GORAI', 'IC COLONY', 'DAHISAR', 'MIRA ROAD', 'BHAYANDAR', 'BHAYANDER',
        'NAIGAON', 'VASAI', 'NALASOPARA', 'NALA SOPARA', 'VIRAR'
    ],
    'Central Suburbs': [
        'DADAR', 'MATUNGA', 'WADALA', 'SION', 'KURLA', 'VIDYAVIHAR', 'TILAK NAGAR', 'CHUNABHATTI', 'GTB NAGAR', 'ANTOP HILL'
    ],
    'Eastern Suburbs': [
        'GHATKOPAR', 'VIKHROLI', 'KANJURMARG', 'BHANDUP', 'NAHUR', 'MULUND', 'POWAI', 'CHANDIVALI'
    ],
    'Harbour / Central-East': [
        'CHEMBUR', 'GOVANDI', 'MANKHURD', 'TROMBAY', 'DEONAR', 'MAHUL', 'VASHI', 'SANPADA',
        'JUINAGAR', 'NERUL', 'SEAWOODS', 'BELAPUR', 'KHARGHAR', 'PANVEL', 'NAVI MUMBAI',
        'AIROLI', 'GHANSOLI', 'KOPARKHAIRANE', 'KOPAR KHAIRANE', 'TURBHE', 'ULWE', 'DRONAGIRI',
        'TALOJA', 'KALAMBOLI', 'KAMOTHE'
    ]
}

def classify(name):
    nu = name.upper()
    for reg, locs in localities_map.items():
        for loc in locs:
            # Whole-word regex match
            if re.search(r'\b' + re.escape(loc) + r'\b', nu):
                return reg, loc
    return 'Unresolved', None

results = {'South Mumbai': 0, 'Western Suburbs': 0, 'Central Suburbs': 0, 'Eastern Suburbs': 0, 'Harbour / Central-East': 0, 'Unresolved': 0}

unresolved_names = []
for n in names:
    reg, loc = classify(n)
    results[reg] += 1
    if reg == 'Unresolved':
        unresolved_names.append(n)

print("\nClassification breakdown for 1309 colleges:")
for reg, count in results.items():
    print(f"  {reg}: {count} colleges ({count/len(names)*100:.1f}%)")

print(f"\nUnresolved count: {len(unresolved_names)}")
print("Sample unresolved names:", unresolved_names[:10])
