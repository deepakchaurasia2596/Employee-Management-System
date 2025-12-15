// Angular imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sf-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      ejs-button
      [attr.type]="type"
      [class.e-btn]="true"
      [ngClass]="cssClass"
      [disabled]="disabled"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class SfButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() cssClass = '';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event) {
    this.clicked.emit(event);
  }
}
