import { Annotation } from '../app.model'

const getLinesStartingWith = (parsedAnn: string[][], startingText: string): string[][] => {
  return parsedAnn.filter((line: string[]) => line[0].startsWith(startingText))
}

const getAnnotationLines = (parsedAnn: string[][]) => getLinesStartingWith(parsedAnn, 'T')
const getCommentLines = (parsedAnn: string[][]) => getLinesStartingWith(parsedAnn, '#')

const findId = (line: string[]): string => line[0]
const findEntity = (line: string[]): string => line[1].split(' ')[0]
const findOffset = (line: string[]): { start: number, end: number } => ({
  start: Number(line[1].split(' ')[1]),
  end: Number(line[1].split(' ')[2])
})
const findEvidence = (line: string[]): string => line[2]
const findNote = (annotationLine: string[], commentLines: string[][]) => {
  const foundNoteLine = commentLines.find((noteLine: string[]) => noteLine[1].split(' ')[1] === annotationLine[0])
  const note = foundNoteLine ? foundNoteLine[2] : ''
  return note
}

export const getAnnotations = (parsedAnn: string[][]): Annotation[] => {
  const annotationLines = getAnnotationLines(parsedAnn)
  const noteLines = getCommentLines(parsedAnn)
  const annotations = annotationLines.map(line => ({
    id: findId(line),
    entity: findEntity(line),
    offset: findOffset(line),
    evidence: findEvidence(line),
    note: findNote(line, noteLines)
  }))
  return annotations
}
