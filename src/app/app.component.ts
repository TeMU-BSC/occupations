import { Component, OnInit } from '@angular/core'
import Fuse from 'fuse.js'

import { emptyAnnotation } from './helpers/brat'
import { simplify } from './helpers/strings'
import { Annotation, Term } from './interfaces'
import { ParsingService } from './parsing.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  files = { terms: '../assets/all.tsv', brat: { txt: '../assets/sample.txt', ann: '../assets/sample.ann' } }
  terms: Term[] = []
  filteredTerms: Term[] = []
  limit: number = 10
  annotations: Annotation[] = []
  currentAnnotation: Annotation = emptyAnnotation
  fuse: Fuse<Term> = new Fuse([])

  constructor(private parser: ParsingService) { }

  ngOnInit() {
    this.parser.getTermsFromTsv(this.files.terms).subscribe(data => {
      this.terms = data
      this.initFuse(this.terms)
      this.parser.getAnnotationsFromFile(this.files.brat.ann).subscribe(data => {
        this.annotations = data
        this.next()
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

  next() {
    const nextAnnotation = this.annotations.shift()
    if (!nextAnnotation) { alert('¡Completado!'); return }
    this.currentAnnotation = nextAnnotation || emptyAnnotation
    const input = document.querySelector('#input') as HTMLInputElement
    input.value = this.currentAnnotation?.evidence || ''
    this.filter(null, { initialCriteria: this.currentAnnotation?.evidence })
  }
}
