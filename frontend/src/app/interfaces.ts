export interface Annotation {
  id: string
  entity: string
  offset: {
    start: number
    end: number
  }
  evidence: string
  note: string
  unspecified?: boolean
}

export interface Term {
  terminology: string
  code: string
  name: string
  synonyms?: string[]
}
