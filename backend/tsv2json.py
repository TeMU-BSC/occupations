import csv
import json
import sys


def tsv2json(input_file=sys.argv[1]):
    output_file = str(input_file).replace('.tsv', '.json')
    with open(input_file) as f:
        items = list(csv.DictReader(f, dialect=csv.excel_tab))
    with open(output_file, 'w') as f:
        json.dump(items, f, ensure_ascii=False)
    return items


if __name__ == '__main__':
    tsv2json()
