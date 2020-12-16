import { Component, OnInit } from '@angular/core'
import Fuse from 'fuse.js'  // https://fusejs.io/

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

  value: string = ''
  terms: Term[] = []
  filteredTerms: Term[] = []
  limit: number = 5
  tweets: Tweet[] = []
  currentTweet: Tweet = new Tweet()
  currentAnnotation: Annotation = new Annotation()
  fuse: Fuse<Term> = new Fuse([])
  exactMatches: Term[] = []

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTerms().subscribe(terms => {
      this.terms = terms
      this.initFuse(this.terms)
      this.api.getTweets().subscribe(async tweets => {
        this.tweets = tweets
        this.currentTweet = this.tweets.shift() as Tweet
        this.nextFinding()
      })
    })
  }

  initFuse(list: any[]) {
    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: ['code', 'name'],
      threshold: 0.3
    }
    this.fuse = new Fuse(list, options)
  }

  filter(criteria: string = this.value) {
    // option 1: javascript filter + includes
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // option 2: fuse.js
    const searchResult = this.fuse?.search(criteria)
    this.filteredTerms = searchResult.map(result => result.item)
  }

  nextFinding() {
    this.currentAnnotation = this.currentTweet?.annotations.shift() as Annotation
    if (!this.currentAnnotation) {
      this.currentTweet = this.tweets.shift() as Tweet
      if (!this.currentTweet) {
        alert('¡Completado!')
        return
      }
      this.currentAnnotation = this.currentTweet?.annotations.shift() as Annotation
    }
    this.value = this.currentAnnotation?.evidence || ''
    this.filter()
    this.exactMatches = this.filteredTerms.filter(term => !term.name.localeCompare(this.value, 'es', { sensitivity: 'base' }))
    this.filteredTerms = this.filteredTerms.filter(term => !this.exactMatches.includes(term))
  }

  previousFinding() {
    alert('previousFinding function must be implemented')
  }

  save() {
    console.log(this.exactMatches)
  }

}
