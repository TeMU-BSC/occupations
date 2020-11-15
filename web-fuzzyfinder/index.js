function fuseHighlight(fuseElement) {
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

// option 1: read directly from all.tsv file
Papa.parse('../terminologies/all.tsv', {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results, file) => {
    console.log("Parsing complete:", results, file)
    // ...
    const list = results.data
    const options = {
      includeScore: true,
      includeMatches: true,
      keys: ['term']
    }
    const fuse = new Fuse(list, options)
    const input = document.querySelector('#searchCriteria')
    const matchesContainer = document.querySelector('#matches')
    input.addEventListener('input', (e) => {
      const criteria = e.target.value
      const result = fuse.search(criteria)
      matchesContainer.innerHTML = ''
      result.slice(0, 10).forEach(element => {
        element.item.term = fuseHighlight(element)
        const p = document.createElement('p')
        p.innerHTML = JSON.stringify(element.item)
        matchesContainer.appendChild(p)
      });
    })
  }
})

// option 2: upload a tsv file
function parse() {
  Papa.parse(document.querySelector('#file').files[0], {
    header: true,
    skipEmptyLines: true,
    complete: (results, file) => {
      console.log("Parsing complete:", results, file)
      // ...
    }
  })
}
