import { Component, OnInit } from '@angular/core'

import { ApiService } from './api.service'
import { simplify } from './helpers/strings'
import { Annotation, Term } from './app.model'
import { Tweet } from './tweet/tweet.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  terms: Term[] = []
  allTerms: Term[] = []
  terminologies: string[] = []
  tweet: Tweet = new Tweet()
  tweets: Tweet[] = []
  annotation: Annotation = new Annotation()
  value: string = ''

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTerms().subscribe(terms => {
      this.allTerms = terms
      this.terminologies = [...new Set(terms.map(term => term.terminology))]
      this.api.getTweets().subscribe(async tweets => {
        this.tweets = tweets
        this.nextTweet()
        this.nextAnnotation()
      })
    })
  }

  nextTweet() {
    this.tweet = this.tweets.shift() as Tweet
    if (!this.tweet) { alert('¡Completado!') }
  }

  nextAnnotation() {
    this.annotation = this.tweet.annotations.shift() as Annotation
    if (!this.annotation) {
      this.nextTweet()
      this.annotation = this.tweet.annotations.shift() as Annotation
    }
    this.value = this.annotation?.evidence || ''
    const exactMatches = this.allTerms.filter(term => !term.name.localeCompare(this.value, 'es', { sensitivity: 'base' }))
    this.terms = exactMatches
    // this.terms = this.terms.filter(term => !exactMatches.includes(term))
  }

  findTerm(terminology: string) {
    return this.terms.find(term => term.terminology === terminology) || new Term()
  }

  previousFinding() {
    console.log('previousFinding() function must be implemented')
  }

  add(term: Term) {
    console.log(term)
  }

  remove(term: Term) {
    console.log(term)
  }

  save() {
    console.log(this.terms)
  }

}
