import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'input-button',
  template: `
    <div class="input-group">
      <span class="input-group-addon">{{name}}</span>
      <input #search type="text" class="form-control" placeholder="{{name}} ...">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" (click)="emitData(search.value)">
          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
        </button>
      </span>
    </div>
  `,
  styles: [`
  `],
})
class InputButtonComponent {
  @Input() name: string = '';
  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>();

  emitData(data: string) {
    this.inputChange.emit(data);
  }
}

export {
  InputButtonComponent,
};
