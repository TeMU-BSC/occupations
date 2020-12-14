import csv
import json
import sys


def tsv2json(input_file=sys.argv[1]):
    with open(input_file) as f:
        return list(csv.reader(f, dialect=csv.excel_tab))


def write_to_disk(items: list, input_file=sys.argv[1]):
    output_file = str(input_file).replace('.tsv', '.json')
    with open(output_file, 'w') as f:
        json.dump(items, f, ensure_ascii=False)


if __name__ == '__main__':
    write_to_disk(tsv2json())
