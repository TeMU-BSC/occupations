const fuseHighlight = (fuseElement) => {
  // https://github.com/krisk/Fuse/issues/6#issuecomment-191937490
  const text = fuseElement.matches[0]?.value
  const matches = fuseElement.matches[0]?.indices
  let pair = matches.shift()

  // Build the formatted string
  const result = []
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i)
    if (pair && i == pair[0]) {
      result.push('<span class=highlight>')
    }
    result.push(char)
    if (pair && i == pair[1]) {
      result.push('</span>')
      pair = matches.shift()
    }
  }
  return result.join('')
}

Papa.parse('../terminologies/all.tsv', {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: results => {
    const list = results.data
    const options = {
      includeScore: true,
      includeMatches: true,
      keys: ['name']
    }
    const fuse = new Fuse(list, options)
    document.querySelector('#input').addEventListener('input', (e) => {
      const criteria = e.target.value
      const result = fuse.search(criteria).slice(0, 10)

      const resultsContainer = document.querySelector('#results')
      resultsContainer.innerHTML = ''
      result.forEach(element => {
        element.item.term = fuseHighlight(element)
        const p = document.createElement('p')
        p.innerHTML = JSON.stringify(element.item)
        resultsContainer.appendChild(p)
      })
    })
  }
})