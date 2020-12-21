import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Term } from './app.model'
import { Tweet } from './tweet/tweet.model'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getTerms(): Observable<Term[]> {
    return this.http.get<Term[]>('http://localhost:5000/terms')
  }

  getTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>('http://localhost:5000/tweets')
  }

  // allTerms: Term[] = []
  // allTweets: Tweet[] = []

  // constructor(private http: HttpClient) {
  //   this.getTerms()
  // }

  // getTerms(): void {
  //   this.http.get<Term[]>('http://localhost:5000/terms').subscribe(terms => this.allTerms = terms)
  // }

  // getTweets(): void {
  //   this.http.get<Tweet[]>('http://localhost:5000/tweets').subscribe(tweets => this.allTweets = tweets)
  // }

}
