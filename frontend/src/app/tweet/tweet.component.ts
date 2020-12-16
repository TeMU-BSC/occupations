import { Component, Input, OnChanges, OnInit } from '@angular/core'
import Mark from 'mark.js'  // https://markjs.io/
import { Annotation } from '../app.model'
import { Tweet } from './tweet.model'

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit, OnChanges {

  @Input() tweet: Tweet = new Tweet()
  @Input() annotation: Annotation = new Annotation()

  instance: Mark = new Mark('.context')

  constructor() { }

  ngOnInit(): void {
    // const context = document.querySelector('.context') as HTMLElement // requires an element with class "context" to exist
    // this.instance = new Mark(context)
  }

  ngOnChanges(): void {
    this.unHighlight()
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
  highlightRange(): void {
    this.instance.unmark({
      done: () => {
        this.instance.markRanges([{
          start: this.annotation.offset.start,
          length: this.annotation.evidence.length
        }])
      }
    })
  }

  unHighlight(): void {
    this.instance.unmark()
  }

}
