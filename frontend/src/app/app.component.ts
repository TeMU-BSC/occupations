import { Component, OnInit } from '@angular/core'
import Fuse from 'fuse.js'

import { ApiService } from './api.service'
import { simplify } from './helpers/strings'
import { Annotation, Document, emptyAnnotation, emptyDocument, Term } from './interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  terms: Term[] = []
  filteredTerms: Term[] = []
  tweets: Document[] = []
  currentTweet: Document | undefined = emptyDocument
  currentAnnotation: Annotation | undefined = emptyAnnotation
  fuse: Fuse<Term> = new Fuse([])
  limit: number = 10
  exactMatches: Term[] = []

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTerms().subscribe(terms => {
      this.terms = terms
      this.initFuse(this.terms)
      this.api.getTweets().subscribe(tweets => {
        this.tweets = tweets
        this.currentTweet = this.tweets.shift()
        this.nextAnnotation()
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

  filter(event: Event | null, options: any = { initialCriteria: '' }) {
    const criteria = options.initialCriteria || (event?.target as HTMLInputElement).value

    // native way
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // with fuse.js
    const searchResult = this.fuse?.search(criteria)
    this.filteredTerms = searchResult.map(result => result.item)
  }

  nextAnnotation() {
    this.currentAnnotation = this.currentTweet?.annotations.shift()
    if (!this.currentAnnotation) {
      this.currentTweet = this.tweets.shift()
      if (!this.currentTweet) {
        alert('¡Completado!')
        return
      }
      this.currentAnnotation = this.currentTweet?.annotations.shift()
    }
    const input = document.querySelector('#input') as HTMLInputElement
    input.value = this.currentAnnotation?.evidence || ''
    this.filter(null, { initialCriteria: this.currentAnnotation?.evidence })
    this.exactMatches = this.filteredTerms.filter(term => !term.name.localeCompare(input.value, 'es', { sensitivity: 'base' }))
    this.filteredTerms = this.filteredTerms.filter(term => !this.exactMatches.includes(term))
  }
}
