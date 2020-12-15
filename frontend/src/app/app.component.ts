import { AfterViewInit, Component, OnInit } from '@angular/core'
import Fuse from 'fuse.js'
import Mark from 'mark.js'

import { ApiService } from './api.service'
import { simplify } from './helpers/strings'
import { Annotation, Document, emptyAnnotation, emptyDocument, Term } from './interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  value: string = ''
  terms: Term[] = []
  filteredTerms: Term[] = []
  tweets: Document[] = []
  currentTweet: Document = emptyDocument
  currentAnnotation: Annotation = emptyAnnotation
  limit: number = 5
  exactMatches: Term[] = []

  fuseInstance: Fuse<Term> = new Fuse([])
  markInstance: Mark = new Mark('.context')

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getTerms().subscribe(terms => {
      this.terms = terms
      this.initFuse(this.terms)
      this.api.getTweets().subscribe(tweets => {
        this.tweets = tweets
        this.currentTweet = this.tweets.shift() as Document
        // this.currentTweet.text = this.currentTweet.text.normalize('NFKD')
        this.nextFinding()
      })
    })
  }

  ngAfterViewInit() {
    this.initMark()
  }

  initFuse(list: any[]) {
    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: ['code', 'name'],
      threshold: 0.3
    }
    this.fuseInstance = new Fuse(list, options)
  }

  initMark() {
    const context = document.querySelector('.context') as HTMLElement // requires an element with class "context" to exist
    this.markInstance = new Mark(context)
  }

  filter(criteria: string = this.value) {
    // native way
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // with fuse.js
    const searchResult = this.fuseInstance?.search(criteria)
    this.filteredTerms = searchResult.map(result => result.item)
  }

  nextFinding() {
    this.currentAnnotation = this.currentTweet?.annotations.shift() as Annotation
    if (!this.currentAnnotation) {
      this.currentTweet = this.tweets.shift() as Document
      // this.currentTweet.text = this.currentTweet.text.normalize('NFKD')
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
    this.highlight()
  }

  previousAnnotation() {
    alert('previousAnnotation function must be implemented')
  }

  /**
  * Highlight the current annotation.
  *
  * https://markjs.io/#markranges
  * https://jsfiddle.net/julmot/hexomvbL/
  * https://github.com/iamdustan/smoothscroll/issues/47#issuecomment-350810238
  * https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  *
  */
  highlight(): void {
    this.markInstance.unmark({
      done: () => this.markInstance.markRanges([{
        start: this.currentAnnotation.offset.start,
        length: this.currentAnnotation.evidence.length
      }])
    })
  }

}
