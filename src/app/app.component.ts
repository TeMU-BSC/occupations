import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import Fuse from 'fuse.js'
import { Papa } from 'ngx-papaparse'
import { Term } from './interfaces'
import { simplify } from 'src/app/helpers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  allTerms: Term[] = []
  filteredTerms: Term[] = []
  sample: string[] = []
  currentTerm: string | undefined = ''
  fuse: Fuse<Term> | undefined = undefined
  limit: number = 10

  constructor(private http: HttpClient, private papa: Papa) {
    this.http.get('../assets/all.tsv', { responseType: 'text' }).subscribe(allTermsTsv => {
      this.papa.parse(allTermsTsv, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          this.allTerms = results.data
          this.readTextFile()
          this.initFuse()
        }
      })
    })
  }

  readTextFile() {
    fetch('../assets/sample.txt')
      .then(response => response.text())
      .then(data => data.split(/[\r\n]+/).forEach(line => line ? this.sample.push(line) : null))
      .then(() => this.next())
  }

  initFuse() {
    const list = this.allTerms
    const options = {
      includeScore: true,
      keys: ['code', 'name'],
      // threshold: 0.4
    }
    this.fuse = new Fuse(list, options)
  }

  filter(initialCriteria: string = '', event: Event = new Event('input')) {
    const input = event.target as HTMLInputElement
    const criteria = initialCriteria ? initialCriteria : input.value

    // primitive way
    // this.filteredTerms = this.allTerms.filter(term => simplify(term.name).includes(simplify(criteria)))

    // with fuse.js
    this.filteredTerms = this.fuse?.search(criteria).map(result => result.item) || []
  }

  next() {
    const input = document.querySelector('#input') as HTMLInputElement
    this.currentTerm = this.sample.shift()
    if (!this.currentTerm) {
      input.value = ''
      this.filteredTerms = []
      alert('¡Completado!')
      return
    }
    input.value = this.currentTerm || ''
    this.filter(this.currentTerm)
  }
}
