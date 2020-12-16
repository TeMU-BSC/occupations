export class Annotation {
  id: string = ''
  entity: string = ''
  offset: { start: number, end: number } = { start: 0, end: 0 }
  evidence: string = ''
  note: string = ''
  unspecified?: boolean = false
}

export class Term {
  terminology: string = ''
  code: string = ''
  name: string = ''
  synonyms?: string[] = []
}
