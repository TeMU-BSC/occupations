import { Component, Input, OnInit } from '@angular/core'
import { emptyTerm, Term } from '../interfaces'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() term: Term = emptyTerm
  @Input() icon: string = 'add'
  @Input() color: string = 'accent'

  constructor() { }

  ngOnInit(): void {
  }

}
