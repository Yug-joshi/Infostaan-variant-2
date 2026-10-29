
import re

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

terms = ['KHANDWALA', 'SHROFF', 'NAGINDAS', 'DAYANAND', 'MAHARSHI', 'SYDENHAM', 'CHINAI', 'BHAVAN', 'GOKHALE', 'CHETANA', 'PATKAR', 'ISMAIL']
for term in terms:
    found = set((m[2], m[7]) for m in matches if term in m[2].upper())
    print(f"Term '{term}': {len(found)} entries found")
    for name, code in list(found)[:4]:
        print(f"   {code} : {name}")
