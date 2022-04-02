import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScribblingPaneComponent } from './scribbling-pane/scribbling-pane.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ScribblingPaneComponent],
  exports: [ScribblingPaneComponent],
})
export class ScribblingModule {}
