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
export const emptyAnnotation: Annotation = { id: '', entity: '', offset: { start: 0, end: 0 }, evidence: '', note: '' }

export interface Term {
  terminology: string
  code: string
  name: string
  synonyms?: string[]
}

export interface Document {
  file: string,
  text: string,
  annotations: Annotation[]
}
export const emptyDocument: Document = { file: '', text: '', annotations: [emptyAnnotation] }
