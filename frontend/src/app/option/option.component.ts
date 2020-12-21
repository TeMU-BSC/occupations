import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Term } from '../app.model'

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent {
  @Input() term: Term = new Term()
  @Input() terminology: string = ''
  @Input() value: string = ''
  @Input() icon: string = 'add'
  @Input() color: string = 'accent'
  @Output() clickOutput: EventEmitter<Term> = new EventEmitter<Term>()
}
