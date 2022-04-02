import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@jdrks/shared';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DarkModeToggleComponent],
  exports: [DarkModeToggleComponent],
})
export class DarkModeModule {}
