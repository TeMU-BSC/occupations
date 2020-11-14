# work-in-progress tsv cleaning

to-do list:
```
[ ] decs: there are very long lines (descriptions)
[x] esco: manually curated masculine/femenine terms by creating new lines
[ ] kbp: @tonifuc3m what are this? do we need it for the project?
[ ] snomedct: do we need the mapping to umls? do we want the umls occupation list (download from umls website)?
[x] wordnet: concatenated, sorted and uniq'd SUMO and TO (there was 1082 coincidences)
```

```shell
cut -f3 all.tsv | sort | uniq -cdi > coincidents
```