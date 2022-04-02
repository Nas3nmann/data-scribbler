import { Component, Input } from '@angular/core';

@Component({
  selector: 'jdrks-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss'],
})
export class CopyButtonComponent {
  @Input()
  data: unknown;

  copyData() {
    window.prompt(
      'Copy to clipboard: Ctrl+C, Enter',
      JSON.stringify(this.data)
    );
  }
}
