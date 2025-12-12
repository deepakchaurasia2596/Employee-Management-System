// Angular imports
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string = '';
  @Input() highlightColor: string = '#ffff00';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.appHighlight) {
      this.highlightText(this.appHighlight);
    }
  }

  private highlightText(searchTerm: string): void {
    const text = this.el.nativeElement.textContent;
    if (!text || !searchTerm) {
      return;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = text.replace(
      regex,
      `<span style="background-color: ${this.highlightColor}">$1</span>`
    );

    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedText);
  }
}

