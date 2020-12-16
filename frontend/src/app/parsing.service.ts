import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Papa } from 'ngx-papaparse'
import { Annotation, Term } from 'src/app/app.model'
import { getAnnotations } from './helpers/brat'

@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  constructor(
    private http: HttpClient,
    private papa: Papa,
  ) { }

  getTextFromFile(filepath: string): Observable<string> {
    return this.http.get(filepath, { responseType: 'text' })
  }

  getTermsFromTsv(filepath: string): Observable<Term[]> {
    return new Observable((observer) => {
      this.papa.parse(filepath, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: results => observer.next(results.data)
      })
    })
  }

  getAnnotationsFromFile(filepath: string): Observable<Annotation[]> {
    return new Observable((observer) => {
      this.papa.parse(filepath, {
        download: true,
        skipEmptyLines: true,
        complete: results => observer.next(getAnnotations(results.data))
      })
    })
  }
}
