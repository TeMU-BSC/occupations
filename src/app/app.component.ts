import { Component, OnInit } from '@angular/core'
import Fuse from 'fuse.js'
import { Papa, ParseResult } from 'ngx-papaparse'
import { Annotation, Term } from './interfaces'
import { simplify } from './helpers/strings'
import { emptyAnnotation, getAnnotations } from './helpers/brat'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  annotations: Annotation[] = []
  currentAnnotation: Annotation = emptyAnnotation
  terms: Term[] = []
  filteredTerms: Term[] = []
  fuse: Fuse<Term> = new Fuse([])
  limit: number = 10

  constructor(private papa: Papa) { }

  ngOnInit() {

    // init terms
    this.papa.parse('../assets/all.tsv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult) => {
        this.terms = results.data

        // init fuse.js instance
        const list = this.terms
        const options = {
          includeScore: true,
          keys: ['code', 'name'],
          threshold: 0.4
        }
        this.fuse = new Fuse(list, options)

        // init annotations
        this.papa.parse('../assets/sample.ann', {
          download: true,
          skipEmptyLines: true,
          complete: (results: ParseResult) => {
            this.annotations = getAnnotations(results.data)
            this.next()
          }
        })
      }
    })
  }

  filter(event: Event | null, options: any = { initialCriteria: '' }) {
    const input = event?.target as HTMLInputElement
    const criteria = options.initialCriteria || input.value

    // native way
    // this.filteredTerms = this.terms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // with fuse.js
    this.filteredTerms = this.fuse?.search(criteria).map(result => result.item)
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
