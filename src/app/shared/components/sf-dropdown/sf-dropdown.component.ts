// External imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-sf-dropdown',
  standalone: true,
  imports: [CommonModule, DropDownListModule],
  template: `
    <ejs-dropdownlist
      [id]="id"
      [dataSource]="dataSource"
      [placeholder]="placeholder"
      [value]="value"
      [fields]="fields"
      [cssClass]="cssClass"
      [enabled]="enabled"
      (change)="onChange($event)"
      [attr.aria-label]="ariaLabel"
    ></ejs-dropdownlist>
  `
})
export class SfDropdownComponent {
  // Input
  @Input() id?: string;
  @Input() dataSource: any[] = [];
  @Input() placeholder = '';
  @Input() value: any;
  @Input() fields?: { text: string; value: string };
  @Input() cssClass = '';
  @Input() enabled = true;
  @Input() ariaLabel?: string;

  // Output
  @Output() valueChange = new EventEmitter<any>();

  // Handle change event
  onChange(event: any) {
    this.valueChange.emit(event.value);
  }
}
