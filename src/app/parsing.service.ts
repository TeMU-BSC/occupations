import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { Papa } from 'ngx-papaparse'
import { Annotation, Term } from 'src/app/interfaces'

@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  annotations: Annotation[] = []

  constructor(
    private http: HttpClient,
    private papa: Papa,
  ) { }

  getTextFromFile(filepath: string): Observable<string> {
    return this.http.get(filepath, { responseType: 'text' })
  }

  getTermsFromTsv(filepath: string): Observable<Term[]> {
    let terms: Term[] = []
    this.papa.parse(filepath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => terms = results.data
    })
    return of(terms)
  }

  getAnnotationsFromFile(filepath: string): Observable<Annotation[]> {
    const annotations: Annotation[] = []
    this.papa.parse(filepath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const annotationLines = results.data.filter((line: string[][]) => line.map((l: string[]) => l[0])[0].startsWith('T'))
        const annotatorNotesLines = results.data.filter((line: string[][]) => line.map((l: string[]) => l[0])[0].startsWith('#'))
        annotationLines.forEach((line: string[]) => {
          let foundNotesLine = annotatorNotesLines.find((note: string) => note[1].split(' ')[1] === line[0])
          annotations.push({
            id: line[0],
            entity: line[1].split(' ')[0],
            offset: {
              start: Number(line[1].split(' ')[1]),
              end: Number(line[1].split(' ')[2]),
            },
            evidence: line[2],
            note: foundNotesLine ? foundNotesLine[2] : null
          })
        })
      }
    })
    this.annotations = annotations
    return of(annotations)
  }
}
