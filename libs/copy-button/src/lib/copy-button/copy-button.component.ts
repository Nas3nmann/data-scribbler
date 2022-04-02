import { Component, Inject, Input } from '@angular/core';
import { WINDOW } from '@jdrks/shared';

@Component({
  selector: 'jdrks-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss'],
})
export class CopyButtonComponent {
  @Input()
  data: unknown;

  constructor(@Inject(WINDOW) private window: Window) {}

  copyData() {
    this.window.prompt(
      'Copy your data to clipboard with Ctrl+C',
      JSON.stringify(this.data)
    );
  }
}
