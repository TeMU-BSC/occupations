import { Pipe, PipeTransform } from '@angular/core'
import Fuse from 'fuse.js'  // https://fusejs.io/
import { Term } from './app.model'

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  options = {
    includeScore: true,
    useExtendedSearch: true,
    keys: ['code', 'name', 'terminology'],
    threshold: 0.3
  }

  transform(terms: Term[], value: string): Term[] {
    if (!terms) { return [] }
    if (!value) { return terms }

    // built-in
    // return terms.filter(term => term.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))

    // fuse.js
    const fuse = new Fuse<Term>(terms, this.options)
    const searchResult = fuse.search(value)
    return searchResult.map(result => result.item)
  }

}
