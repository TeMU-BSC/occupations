import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core'
import Mark from 'mark.js'  // https://markjs.io/
import { Annotation } from '../app.model'
import { Tweet } from './tweet.model'

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnChanges, AfterViewInit {

  @Input() tweet: Tweet = new Tweet()
  @Input() annotation: Annotation = new Annotation()

  instance: Mark = new Mark('.context')

  constructor() { }

  ngOnChanges(): void {
    this.highlight()
  }

  ngAfterViewInit(): void {
    this.highlight()
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
    this.instance.unmark({
      done: () => {
        this.instance.mark(this.annotation.evidence, { separateWordSearch: false })
      }
    })
  }

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
