import urllib.request
import json
import re

req = urllib.request.Request('https://en.wikipedia.org/wiki/List_of_Regional_Transport_Office_districts_in_India', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
# Find all occurrences of RTO codes and districts
matches = re.findall(r'<td>([A-Z]{2}[-\s]?\d{1,2}[A-Z]?)</td>\s*<td>(.*?)</td>', html)

data = []
for code, district in matches:
    c = code.replace('-', '').replace(' ', '')
    d = district.strip()
    d = re.sub(r'<.*?>', '', d)
    if len(c) >= 4 and len(c) <= 5:
        data.append({"code": c, "district": d})

print(f"Found {len(data)} RTOs")
with open('rto.json', 'w') as f:
    json.dump(data, f)
