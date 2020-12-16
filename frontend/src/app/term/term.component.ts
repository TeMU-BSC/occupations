import { Component, Input, OnInit } from '@angular/core'
import { Term } from '../app.model'

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {

  @Input() term: Term = new Term()
  @Input() icon: string = 'add'
  @Input() color: string = 'accent'

  constructor() { }

  ngOnInit(): void {
  }

}
