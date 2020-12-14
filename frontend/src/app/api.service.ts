import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Document, Term } from './interfaces'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getTerms(): Observable<Term[]> {
    return this.http.get<Term[]>('http://localhost:5000/terms')
  }

  getTweets(): Observable<Document[]> {
    return this.http.get<Document[]>('http://localhost:5000/tweets')
  }
}
