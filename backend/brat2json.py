import csv
import sys
from pathlib import Path
import os

from tsv2json import tsv2json


def get_lines_starting_with(ann: list, starting_text: str) -> list:
    return filter(lambda line: line[0].startswith(starting_text), ann)


def get_annotation_lines(ann: list) -> list:
    return get_lines_starting_with(ann, 'T')


def get_comment_lines(ann: list) -> list:
    return get_lines_starting_with(ann, '#')


def find_id(line: list) -> str:
    return line[0]


def find_entity(line: list) -> str:
    return line[1].split(' ')[0]


def find_offset(line: list) -> dict:
    return dict(
        start=int(line[1].split(' ')[1]),
        end=int(line[1].split(' ')[2])
    )


def find_evidence(line: list) -> str:
    return line[2]


def find_note(ann_line: list, comment_lines: list) -> str:
    found_note_line = [line for line in comment_lines if line[1].split(' ')[
        1] == ann_line[0]]
    note = found_note_line[2] if found_note_line else ''
    return note


def get_annotations(ann: list) -> list:
    ann_lines = get_annotation_lines(ann)
    note_lines = get_comment_lines(ann)
    annotations = list()
    for line in ann_lines:
        annotations.append(dict(
            id=find_id(line),
            entity=find_entity(line),
            offset=find_offset(line),
            evidence=find_evidence(line),
            note=find_note(line, note_lines),
        ))
    return annotations


def brat2json(input_files=sys.argv[1]):
    input_files_path = Path(input_files)
    not_empty_files_tuples = [(ann_file.with_suffix('.txt'), ann_file) for ann_file in input_files_path.glob(
        '**/*.ann') if os.stat(ann_file).st_size > 0]
    results = list()
    for txt_file, ann_file in not_empty_files_tuples:
        with open(txt_file) as f:
            text = f.read()
        ann = tsv2json(ann_file)
        annotations = get_annotations(ann)
        results.append(
            dict(file=str(txt_file), text=text, annotations=annotations))
    return results


if __name__ == '__main__':
    brat2json()
