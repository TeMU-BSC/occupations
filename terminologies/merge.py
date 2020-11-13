'''
Merge different terminologies from 2-column (code\tterm) tsv files.

Usage: python merge.py all.tsv ./*.tsv

Author: https://github.com/aasensios
'''

import csv
import os
import sys

output_file = sys.argv[1]
input_files = sys.argv[2:]

merged = list()

for input_file in input_files:

    with open(input_file) as f:
        reader = csv.reader(f, dialect=csv.excel_tab)
        rows = list(reader)
        for row in rows:
            base = os.path.basename(input_file)
            filename = os.path.splitext(base)[0]
            row.insert(0, filename)
            merged.append(row)

with open(output_file, 'w') as f:
    writer = csv.writer(f, dialect=csv.excel_tab)
    writer.writerows(merged)
