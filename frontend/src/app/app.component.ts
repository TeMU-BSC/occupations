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

  tweets: Tweet[] = []
  tweet: Tweet = new Tweet()
  annotation: Annotation = new Annotation()
  value: string = ''
  fuse: Fuse<Term> = new Fuse([])
  terms: Term[] = []
  filteredTerms: Term[] = []
  limit: number = 5
  exactMatches: Term[] = []

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTerms().subscribe(terms => {

      // work in progress
      const groupByKey = (list: any[], key: string) => list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {})
      const termsByTerminology = groupByKey(terms, 'terminology')
      console.log('termsByTerminology', termsByTerminology)

      this.terms = terms
      this.fuse = this.initFuse(this.terms)
      this.api.getTweets().subscribe(async tweets => {
        this.tweets = tweets
        this.nextTweet()
        this.nextAnnotation()
      })
    })
  }

  initFuse(list: Term[]): Fuse<Term> {
    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: ['code', 'name', 'terminology'],
      threshold: 0.3
    }
    const index = Fuse.createIndex(options.keys, list)
    return new Fuse(list, options, index)
  }

  filter(criteria: string) {
    // option 1: javascript filter + includes
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // option 2: fuse.js
    const searchResult = this.fuse?.search(criteria)
    this.filteredTerms = searchResult.map(result => result.item)
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
    this.filter(this.value)
    this.exactMatches = this.filteredTerms.filter(term => !term.name.localeCompare(this.value, 'es', { sensitivity: 'base' }))
    this.filteredTerms = this.filteredTerms.filter(term => !this.exactMatches.includes(term))
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
    console.log(this.exactMatches)
  }

}
