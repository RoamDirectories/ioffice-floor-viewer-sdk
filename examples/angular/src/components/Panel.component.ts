import { Component, Input } from '@angular/core';

@Component({
  selector: 'panel',
  template: `
    <div [ngClass]="['panel', 'panel-' + type]">
      <div class="panel-heading"><h3 class="panel-title">{{title}}</h3></div>
      <div class="panel-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
class PanelComponent {
  @Input() title: string = '';
  @Input() type: string = 'info';
}

export {
  PanelComponent,
};
