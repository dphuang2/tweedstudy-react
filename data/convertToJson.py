# Read CSV, write JSON
# Refactor this to do the other files. It works though
import csv
import json

with open("parameters.txt", "r") as f:
    params = [l.strip() for l in f]

outObj = []
with open("friends.csv", "r") as f: 
    dr = csv.DictReader(f)
    for line in dr:
        outObj.append({key: line[key] for key in params if key in line})

with open("friends.json", "w") as w:
    json.dump(outObj, w)

