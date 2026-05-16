import json
import os

pobrane_oferty = [
    {"title": "Python Data Scientist", "company": "SpaceX", "technologies": "Python, SQL, AI", "salary": "15000 PLN"},
    {"title": "Cybersecurity Specialist", "company": "Asseco", "technologies": "Linux, Wireshark", "salary": "12000 PLN"},
    {"title": "DevOps Engineer", "company": "CD Projekt", "technologies": "Docker, AWS", "salary": "14000 PLN"}
]

sciezka_zapisu = os.path.join(os.path.dirname(__file__), '../server/oferty.json')

with open(sciezka_zapisu, 'w', encoding='utf-8') as f:
    json.dump(pobrane_oferty, f, ensure_ascii=False, indent=4)

print("Dane z zewnętrznego rynku zostały pobrane!")