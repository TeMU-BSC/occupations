import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'
import { MatChip } from '@angular/material/chips'
import { Term } from '../app.model'

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent {
  @Input() term: Term = new Term()
  @Input() terminology: string = ''
  @Input() value: string = ''
  @Input() icon: string = 'add'
  @Input() color: string = 'accent'
  @Output() clickOutput: EventEmitter<Term> = new EventEmitter<Term>()
  selected = true
}
