import { ENTER } from '@angular/cdk/keycodes'
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'
import { debounceTime, map, startWith } from 'rxjs/operators'
import { ApiService } from '../api.service'
import { Annotation, Term } from '../app.model'
import { removeConsecutiveSpaces } from '../helpers/strings'

@Component({
  selector: 'app-terms-search',
  templateUrl: './terms-search.component.html',
  styleUrls: ['./terms-search.component.scss']
})
export class TermsSearchComponent implements OnChanges {

  // @Input() doc: Doc
  // @Input() formConfig: FormConfig
  @Input() removable: boolean = true
  @Output() termEmitter = new EventEmitter<Term>()
  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete!: MatAutocomplete
  autocompleteChipList = new FormControl()
  separatorKeysCodes: number[] = [ENTER]
  options: Term[] = []
  filteredOptions: Observable<Term[]>
  chips: any = []
  // annotation: Annotation = new Annotation()

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.api.getTerms().subscribe(terms => this.options = terms)
    this.filteredOptions = this.autocompleteChipList.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map((value: string | null) => value
        ? this.customFilter(value, 'name', ['name', 'code', 'termonology'])
        : [])
    )
  }

  /**
   * This component implements OnChanges method so it can react to parent changes on its @Input() 'doc' property.
   */
  ngOnChanges() {
    // // get the current annotations from the user
    // this.chips = this.options.filter(term => this.doc.decsCodes.includes(term.decsCode))
    // // if initial view (not validation phase), exit
    // if (!this.validation) { return }
    // // if doc is validated, get the finished validated annotations and exit
    // if (this.doc.validated) {
    //   this.api.getValidatedDecsCodes({ user: this.auth.getCurrentUser().id, doc: this.doc.id }).subscribe(
    //     response => this.chips = this.options.filter(term => response.validatedDecsCodes.includes(term.decsCode))
    //   )
    //   return
    // }
    // // otherwise it's validation mode, add suggestions to chips list
    // this.api.getSuggestions({ doc: this.doc.id, user: this.auth.getCurrentUser().id }).subscribe(
    //   response => {
    //     // get suggestions from other users
    //     const suggestions = this.options.filter(term => response.suggestions.includes(term.decsCode))
    //     // set icon for chips previously added by the current user
    //     this.chips.forEach(chip => {
    //       chip.iconColor = 'accent'
    //       chip.iconName = 'person'
    //     })
    //     // remove possible duplicated chips
    //     this.chips = this.chips.filter(chip => !suggestions.includes(chip))
    //     // merge the two lists
    //     this.chips = this.chips.concat(suggestions)
    //   }
    // )
  }

  /**
   * Custom filter for the terms.
   */
  customFilter(input: string, sortingKey: string, filterKeys: string[]): Term[] {
    // ignore the starting and ending whitespaces; replace double/multiple whitespaces by single whitespace
    input = removeConsecutiveSpaces(input)
    // avoid showing the terms that are already added to current evidence
    const alreadyAdded = (term: Term) => this.chips.some((chip: any) => chip.code === term.code)
    const remainingTerms = this.options.filter(term => !alreadyAdded(term))
    // filter the available terms by the given keys checking if input is included in value
    // const filtered = remainingTerms.filter(term => filterKeys.some(key => inputIncludedInValue(input, term, key)))
    const filtered = this.options
    return filtered
  }

  addTerm(event: MatAutocompleteSelectedEvent): void {
    const term: Term = event.option.value
    this.termEmitter.emit(term)
  }

  // /**
  //  * Open a confirmation dialog before performing an action to a given array and optionally apply changes to backend.
  //  */
  // confirmDialogBeforeAdd(chip: Term): void {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //     width: '500px',
  //     data: {
  //       title: `${chip.termSpanish} (${chip.decsCode})`,
  //       content: '¿Quieres borrar esta anotación?',
  //       cancel: 'Cancelar',
  //       buttonName: 'Borrar',
  //       color: 'warn'
  //     }
  //   })
  //   dialogRef.afterClosed().subscribe(confirmation => {
  //     if (confirmation) {
  //       this.removeChip(chip)
  //     }
  //   })
  // }

  alert(x: any) {
    alert(x)
  }

}
