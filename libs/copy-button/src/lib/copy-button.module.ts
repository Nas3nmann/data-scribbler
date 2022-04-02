import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyButtonComponent } from './copy-button/copy-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CopyButtonComponent],
  exports: [CopyButtonComponent],
})
export class CopyButtonModule {}
