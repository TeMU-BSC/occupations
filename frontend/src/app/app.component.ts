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
      keys: ['code', 'name'],
      threshold: 0.4
    }
    this.fuse = new Fuse(list, options)
  }

  filter(event: Event | null, options: any = { initialCriteria: '' }) {
    const input = event?.target as HTMLInputElement
    const criteria = options.initialCriteria || input.value
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))  // native way
    this.filteredTerms = this.fuse?.search(criteria).map(result => result.item)  // with fuse.js
  }

  nextAnnotation() {
    this.currentAnnotation = this.currentTweet?.annotations.shift()
    if (!this.currentAnnotation) {
      this.currentTweet = this.tweets.shift()
      this.currentAnnotation = this.currentTweet?.annotations.shift()
      if (!this.currentTweet) {
        alert('¡Completado!')
        return
      }
      return
    }
    const input = document.querySelector('#input') as HTMLInputElement
    input.value = this.currentAnnotation.evidence || ''
    this.filter(null, { initialCriteria: this.currentAnnotation.evidence })
  }
}
