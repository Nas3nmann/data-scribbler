import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage/local-storage.token';
import { WINDOW } from './window/window.token';

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: LOCAL_STORAGE, useValue: localStorage },
    { provide: WINDOW, useValue: window },
  ],
})
export class SharedModule {}
